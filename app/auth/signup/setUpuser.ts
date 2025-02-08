import { doc, serverTimestamp, setDoc } from "firebase/firestore"; ``
import { db } from "../../api/firebase/firebaseConfig";

export async function setUpUser(email: string, uid: string, name: string) {

    try {
        const userRef = doc(db, 'users', uid);
        const userData = {
            Name: email,
            email: email,
            Agents: [],
            Created_At: serverTimestamp(), 
            role: 'user'
        }
        await setDoc(userRef, userData);


    } catch (error) {
        return error;

    } finally {
        return { 'message': 'User Created Successfully!', 'status': 200 }
    }
}


