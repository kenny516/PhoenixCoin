import { auth, db } from "@/firebase/firebaseConfig";
import { Profil } from "@/utils/type";
import { collection, doc, getDoc } from "firebase/firestore";


export const getUser = async () => {
    const userCurrent = await auth.currentUser;
    if (!userCurrent) return null;
    const ProfRef = doc(db, "profil", userCurrent.uid);
    const docSnap = await getDoc(ProfRef);
    if (docSnap.exists()) {
        let profil: Profil = {
            id: docSnap.id,
            nom: docSnap.data().nom,
            prenom: docSnap.data().prenom,
            dateNaissance: docSnap.data().dateNaissance,
            pdp: docSnap.data().pdp,
            expoPushToken: docSnap.data().pushToken,
            fondsActuel: docSnap.data().fondsActuel,
            email: userCurrent.email ? userCurrent.email : "",
        }
        return profil;
    }
}