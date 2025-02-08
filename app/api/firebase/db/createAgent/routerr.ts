// import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
// import { NextResponse, NextRequest } from "next/server";
// import { db } from "@/app/api/firebase/firebaseConfig";


// export async function POST(req: NextRequest) {

//     try {
//         const data = await req.json();
        
//     //     // Form system message based on agent type and configuration
//         let systemMessage = `You are an AI assistant with the following characteristics:\nName: ${data.name}\nDescription: ${data.description}\n`;
        
//         if (data.type === "text") {
//             systemMessage += `Personality: ${data.textConfig.personality}\n`;
//             systemMessage += `Tone: ${data.textConfig.tone}\n`;
//             systemMessage += `Areas of Expertise: ${data.textConfig.expertise.join(", ")}\n`;
//             systemMessage += `Context Memory: ${data.textConfig.contextMemory} messages`;
//         } else if (data.type === "content") {
//             systemMessage += `Style: ${data.contentConfig.style}\n`;
//             systemMessage += `Color Palette: ${data.contentConfig.colorPalette.join(", ")}\n`;
//             systemMessage += `Resolution: ${data.contentConfig.resolution}\n`;
//             systemMessage += `Aspect Ratio: ${data.contentConfig.aspectRatio}`;
//         }

//         // Get current user from auth
    

 
//         // Check if agent name already exists
//         let agentRef;
//         let agentSnapshot;


//         try {
//             if (!db) {
//                 throw new Error("Firebase database not initialized");
//             }
            
//             agentRef = doc(db, 'agents', data.name);
//             if (!agentRef) {
//                 throw new Error("Failed to create document reference");
//             }
            
//             agentSnapshot = await getDoc(agentRef);
//             console.log("Successfully got document snapshot"); // Debug log
            
//         } catch (error) {
//             console.error("Detailed error:", error); // This will show in server logs
//             throw new Error(`Failed to check existing agent: ${error}`);
//         }
        
//         // if (agentSnapshot.exists()) {
//         //     throw new Error("An agent with this name already exists");
//         // }

//         return   NextResponse.json({
//             message: "Agent created successfully",
//             agentId: data.name 
//             , systemMessagee: systemMessage
//             , agentSnapshot: agentSnapshot
//            });

//         // Create new agent document
//         // const agentData = {
//         //     ...data,
//         //     systemMessage,
//         //     createdBy: data.userId,
//         //     createdAt: new Date().toISOString()
//         // };
        
//         // try {
//         //     await setDoc(agentRef, agentData);
//         // } catch (error: any) {
//         //     throw new Error("Failed to create agent document: " + error.message);
//         // }

//         // // Update user's agents array
//         // try {
//         //     const { db } = await import("../../firebaseConfig");
//         //     const { doc, updateDoc, arrayUnion } = await import("firebase/firestore");
//         //     const userRef = doc(db, 'users', data.userId);
//         //     await updateDoc(userRef, {
//         //         Agents: arrayUnion(data.name)
//         //     });
//         // } catch (error: any) {
//         //     // If user update fails, try to rollback agent creation
//         //     try {
//         //         await deleteDoc(agentRef);
//         //     } catch (rollbackError: any) {
//         //         console.error("Rollback failed:", rollbackError);
//         //     }
//         //     throw new Error("Failed to update user's agents: " + error.message);
//         // }

//         // return NextResponse.json({ 
//         //     message: "Agent created successfully",
//         //     agentId: data.name 
//         // });

//     } 
    
//     catch (error) {
//         if (error instanceof Error) {
//             console.error("Error creating agent:", error);
//             return NextResponse.json(
//                 { error: 'error.message '},
//                 { status: 500 }
//             );
//         }
//         // Handle unknown errors
//         console.error("Unknown error creating agent:", error);
//         return NextResponse.json(
//             { error: "An unexpected error occurred" },
//             { status: 500 }
//         );
//     }
// }
