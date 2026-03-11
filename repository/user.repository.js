// container code that talks to database
const user = require("../models/user");

export async function create(email, data) {
    // save data in user table   
    try {


    } catch (e) {

    }
}
export function findOneAndUpdate(email, query) {
    // save user data by id
    
}

export function deleteUserById(id) {

}
export async function getUser() {
    const res = await user.findOne({ email }).catch((error) => {
        console.log("Error while getting user from database", error)
        throw error
    });
    return res
}