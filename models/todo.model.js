import mongoose, { Schema } from "mongoose";


const todoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    dueDate: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
        get: v => v.toLocaleDateString(),
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        get: v => v.toLocaleDateString(),
    },
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
});


todoSchema.statics.create = async function (title, description, dueDate, priority, userId) {

    const todo = new this({
        title: title,
        userId: userId,
        ...(description && { description: description }),
        ...(dueDate && { dueDate: dueDate }),
        ...(priority && { priority: priority })
    });

    await todo.save();

    return todo;
};

const Todo = mongoose.model('todo', todoSchema)

export default Todo