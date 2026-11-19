import mongoose, { Schema, Document } from "mongoose";

export type ContentType = "youtube" | "twitter" | "reddit" | "instagram" | "article" | "other";

export interface IContent extends Document {
  userId: mongoose.Types.ObjectId;
  type: ContentType;
  url: string;
  title: string;
  tags: string[];
  createdAt: Date;
  extractedText: string;
  embedding: number[];
  vectorId:string;
  indexed:boolean
}

const ContentSchema = new Schema<IContent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["youtube", "twitter", "reddit", "instagram", "article", "other"],
      required: true,
    },
    url: { type: String, required: true },
    title: { type: String, required: true },
    tags: [{ type: String }],
    extractedText: { type: String },
embedding: { type: [Number], select: false },
vectorId: { type: String, index: true },
indexed: { type: Boolean, default: false },
  },
  { timestamps: true }
  
);

export const Content = mongoose.model<IContent>("Content", ContentSchema);
