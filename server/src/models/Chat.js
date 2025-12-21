import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxLength: 2000
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const chatSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }],
  messages: [messageSchema],
  lastMessage: {
    content: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    createdAt: Date
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
chatSchema.index({ participants: 1 });
chatSchema.index({ updatedAt: -1 });

// Update lastMessage when a new message is added
chatSchema.methods.addMessage = async function(senderId, content) {
  const message = {
    sender: senderId,
    content: content,
    createdAt: new Date()
  };
  
  this.messages.push(message);
  this.lastMessage = {
    content: content,
    sender: senderId,
    createdAt: message.createdAt
  };
  this.updatedAt = new Date();
  
  await this.save();
  return this.messages[this.messages.length - 1];
};

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
