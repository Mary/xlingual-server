const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const express = require('express');
const sinon = require('sinon');
// const jwt = require('jsonwebtoken');

const app = require('../index');
const Word = require('../models/wordModel.js');
const User = require('../models/userModel')

const {TEST_DATABASE_URL} = require('../config');
const {dbConnect, dbDisconnect} = require('../db-mongoose');

process.stdout.write('\x1Bc\n');

chai.use(chaiHttp);
const expect = chai.expect;
const sandbox = sinon.createSandbox();

const { words, users } = require('../dummydata/dummydata.js')
describe('xlingual API - My-List', function () {

  let user = {};
  let token;
  before(function () {
    return mongoose.connect(TEST_MONGODB_URI, { useNewUrlParser: true })
      .then(() => Promise.all([
        Tag.createIndexes(),
        Folder.createIndexes()
      ]));
  });

  beforeEach(function () {
    return Promise.all([
      User.insertMany(users),
      Note.insertMany(notes),
      Folder.insertMany(folders),
      Tag.insertMany(tags),
    ])
      .then(([users]) => {
        user = users[0];
        token = jwt.sign({ user }, JWT_SECRET, { subject: user.username });
      });
  });

  afterEach(function () {
    sandbox.restore();
    return Promise.all([
      User.deleteMany(),
      Note.deleteMany(),
      Folder.deleteMany(),
      Tag.deleteMany(),
    ]);
  });

  after(function () {
    return mongoose.connection.db.dropDatabase()
      .then(() => mongoose.disconnect());
  });

  describe('GET /api/notes', function () {

    it('should return the correct number of Notes', function () {
      return Promise.all([
        Note.find({ userId: user.id }),
        chai.request(app)
          .get('/api/notes')
          .set('Authorization', `Bearer ${token}`)
      ])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    });

    it('should return a list sorted desc with the correct right fields', function () {
      return Promise.all([
        Note.find({ userId: user.id }).sort({ updatedAt: 'desc' }),
        chai.request(app)
          .get('/api/notes')
          .set('Authorization', `Bearer ${token}`)
      ])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
          res.body.forEach(function (item, i) {
            expect(item).to.be.a('object');
            // Note: folderId, tags and content are optional
            expect(item).to.include.all.keys('id', 'title', 'createdAt', 'updatedAt', 'userId');
            expect(item.id).to.equal(data[i].id);
            expect(item.title).to.equal(data[i].title);
            expect(item.content).to.equal(data[i].content);
            expect(item.userId).to.equal(data[i].userId.toString());
            expect(new Date(item.createdAt)).to.eql(data[i].createdAt);
            expect(new Date(item.updatedAt)).to.eql(data[i].updatedAt);
          });
        });
    });

    it('should return correct search results for a searchTerm query', function () {
      const searchTerm = 'lady gaga';

      const re = new RegExp(searchTerm, 'i');
      const dbPromise = Note
        .find({
          userId: user.id,
          $or: [{ title: re }, { content: re }]
        })
        .sort({ updatedAt: 'desc' });

      const apiPromise = chai.request(app)
        .get(`/api/notes?searchTerm=${searchTerm}`)
        .set('Authorization', `Bearer ${token}`);

      return Promise.all([dbPromise, apiPromise])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
          res.body.forEach(function (item, i) {
            expect(item).to.be.a('object');
            expect(item).to.include.all.keys('id', 'title', 'createdAt', 'updatedAt', 'tags'); // Note: folderId and content are optional
            expect(item.id).to.equal(data[i].id);
            expect(item.title).to.equal(data[i].title);
            expect(item.content).to.equal(data[i].content);
            expect(new Date(item.createdAt)).to.eql(data[i].createdAt);
            expect(new Date(item.updatedAt)).to.eql(data[i].updatedAt);
          });
        });
    });

    it('should return correct search results for content search', function () {
      const searchTerm = 'lorem ipsum';
      const re = new RegExp(searchTerm, 'i');
      const dbPromise = Note
        .find({
          userId: user.id,
          $or: [{ title: re }, { content: re }]
        })
        .sort({ updatedAt: 'desc' });
      const apiPromise = chai.request(app)
        .get(`/api/notes?searchTerm=${searchTerm}`)
        .set('Authorization', `Bearer ${token}`);

      return Promise.all([dbPromise, apiPromise])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
          res.body.forEach(function (item, i) {
            expect(item).to.be.a('object');
            expect(item).to.include.all.keys('id', 'title', 'createdAt', 'updatedAt', 'tags'); // Note: folderId and content are optional
            expect(item.id).to.equal(data[i].id);
            expect(item.title).to.equal(data[i].title);
            expect(item.content).to.equal(data[i].content);
            expect(new Date(item.createdAt)).to.eql(data[i].createdAt);
            expect(new Date(item.updatedAt)).to.eql(data[i].updatedAt);
          });
        });
    });

    it('should return correct search results for a folderId query', function () {
      let data;
      return Folder.findOne()
        .then((_data) => {
          data = _data;
          return Promise.all([
            Note.find({ folderId: data.id, userId: user.id }),
            chai.request(app)
              .get(`/api/notes?folderId=${data.id}`)
              .set('Authorization', `Bearer ${token}`)
          ]);
        })
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    });

    it('should return correct search results for a tagId query', function () {
      let data;
      return Tag.findOne()
        .then((_data) => {
          data = _data;
          return Promise.all([
            Note.find({ tags: data.id, userId: user.id, }),
            chai.request(app)
              .get(`/api/notes?tagId=${data.id}`)
              .set('Authorization', `Bearer ${token}`)
          ]);
        })
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    });

    it('should return an empty array for an incorrect query', function () {
      const searchTerm = 'NOT-A-VALID-QUERY';
      const re = new RegExp(searchTerm, 'i');
      const dbPromise = Note.find({
        userId: user.id,
        $or: [{ title: re }, { content: re }]
      }).sort({ updatedAt: 'desc' });

      const apiPromise = chai.request(app)
        .get(`/api/notes?searchTerm=${searchTerm}`)
        .set('Authorization', `Bearer ${token}`);

      return Promise.all([dbPromise, apiPromise])
        .then(([data, res]) => {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.length(data.length);
        });
    });

    it('should catch errors and respond properly', function () {
      sandbox.stub(Note.schema.options.toJSON, 'transform').throws('FakeError');

      return chai.request(app)
        .get('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(500);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body.message).to.equal('Internal Server Error');
        });
    });

  });
