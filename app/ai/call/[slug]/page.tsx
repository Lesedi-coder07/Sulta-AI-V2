// import { CallInterface } from '@/components/ai/call/call-interface'
import CallInterface from "@/components/ai/call/call-interface"
import * as admin from 'firebase-admin';
if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }

const db = admin.firestore();

export default  function CallAgentPage ({params} : {params: {slug : string}}) {
    const url_data = params.slug

    const getAgentData = async () => {
        const docRef =  db.collection('agents').doc(url_data)
        const docSnap = await docRef.get()
        const agentData = docSnap.data()
        if (agentData) {
            return agentData
        } else {
            return null
        }
    }

    const agentData = getAgentData()
    if (!agentData) {
        return <div>Agent not found</div>
    }
    

    return (
        <>
        
          {/* Call Interface */}
  <CallInterface agent_id={url_data}/>
        </>
    )
}