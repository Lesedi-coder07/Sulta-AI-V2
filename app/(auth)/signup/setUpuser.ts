import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../api/firebase/firebaseConfig";

export async function setUpUser(email: string, uid: string, name: string) {
    const userRef = doc(db, 'users', uid);
    const userData = {
        name,
        email,
        agents: [],
        createdAt: serverTimestamp(),
        role: 'user'
    };

    await setDoc(userRef, userData, { merge: true });

    return { message: 'User Created Successfully!', status: 200 };
}

