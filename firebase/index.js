import { initializeApp,cert } from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";

import serviceAccount from "../config/service.json" assert {type: 'json'};
const app=initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://ecommerce-40eb6.firebaseio.com",
});

const auth=getAuth(app)
export default auth

