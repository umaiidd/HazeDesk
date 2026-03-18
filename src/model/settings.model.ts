import { Schema, model, models, Document } from "mongoose";

interface ISettings extends Document {
    ownerId: string
    businessName: string
    supportEmail: string 
    knowledge: string
}

const settingsSchema = new Schema<ISettings>({
    ownerId:       { type: String, required: true, unique: true },
    businessName:  { type: String, required: true },
    supportEmail:  { type: String, required: true },
    knowledge:     { type: String, default: "" },
}, {
    timestamps: true  
})

const Settings = models.Settings || model<ISettings>("Settings", settingsSchema)

export default Settings
