const users = [
    {
        _id: "000000000000000000000001",
        username: "Biscuit",
        userlang: "Japanese"
    },
    {
        id: "000000000000000000000002",
        username: "Banner",
        userlang: "English"

    }
]

const words = [
    {
        _id: '111111111111111111111101',
        name: "neko",
        language: "Japanese",
        description: ["Japanese for 'cat'."],
        global: false,
        user_Id: "000000000000000000000001"
    },
    {
        id: '111111111111111111111102',
        name: "inu",
        language: "Japanese",
        description: ["Japanese for 'dog'."],
        global: false,
        user_Id: "000000000000000000000002"
    },
    {
        id: '111111111111111111111103',
        name: "envelope",
        language: "English",
        description: ["To cover something completely."],
        global: false,
        user_Id: "000000000000000000000001"
    },
    {
        id: '111111111111111111111104',
        name: "yabai",
        language: "Japanese",
        description: ["Slang for cool."],
        global: true,
        user_Id: "000000000000000000000002"
    }
]

module.exports = { words, users };