import Todo from "../../models/todo.model.js"
import generateResponse from "../../lib/generateResponse.js"
import HttpStatus from "../../lib/httpStatus.js"

export const create = async (req, res) => {
    const { title, description, dueDate, priority } = req.body
    try {
        const newTodo = await Todo.create(title, description, dueDate, priority)
        generateResponse(
            res,
            HttpStatus.OK,
            'Todo successfully created',
            newTodo
        )
    } catch (err) {
        console.error(`[${new Date().toISOString()}]`, err)
        generateResponse(
            res,
            err?.status || HttpStatus.BadRequest,
            err?.message
        )
    }
}

export const get = async (req, res) => {

    const page = Number(req?.query?.page)
    const take = Number(req?.query?.take)
    const startIndex = (page - 1) * take
    const endIndex = startIndex + take
    let pagination = {}
    const whereClause = {}
    const andConditions = [];
    const user = req?.user

    const search = req?.query?.search ? String(req?.query?.search) : undefined

    const completed = req?.query?.completed === undefined ? undefined : req?.query?.completed === 'true' ? true : false


    if (search) {
        whereClause.$or = [
            {
                title: {
                    $regex: search,
                    $options: 'i',
                },
            },
            {
                description: {
                    $regex: search,
                    $options: 'i',
                },
            },
        ];
    }

    andConditions.push({
        _id: user?._id,
    });

    if (completed !== undefined) {
        andConditions.push({
            completed: completed,
        });
    }

    if (andConditions.length > 0) {
        whereClause.$and = andConditions;
    }

    try {

        const todo = await Todo.find(whereClause && whereClause)
            .select('title description priority dueDate completed')
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(take)

        const count = await Todo.countDocuments(whereClause);

        const totalPage = Math.ceil(count / take);

        if (endIndex < count) {
            pagination.next = {
                page: page + 1,
                take: take,
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                take: take,
            };
        }

        pagination.currentPage = page;
        pagination.currentTake = take;
        pagination.totalPage = totalPage;
        pagination.totalResult = count;

        generateResponse(
            res,
            HttpStatus.OK,
            'Todo fetched successfully',
            {
                data: todo,
                pagination: pagination,
            }
        )
    } catch (err) {
        console.error(`[${new Date().toISOString()}]`, err)
        generateResponse(
            res,
            err?.status || HttpStatus.Unauthorized,
            err?.message
        )
    }
}

export const deleteTodo = async (req, res) => {
    const { id } = req.body
    try {
        const deletedTodo = await Todo.deleteOne({ _id: id })
        generateResponse(
            res,
            HttpStatus.OK,
            'Todo successfully deleted',
            deletedTodo
        )
    } catch (err) {
        console.error(`[${new Date().toISOString()}]`, err)
        generateResponse(
            res,
            err?.status || HttpStatus.BadRequest,
            err?.message
        )
    }
}

export const update = async (req, res) => {
    const { id, title, description, dueDate, priority } = req.body
    try {

        const updateFields = {};

        if (title !== undefined) updateFields.title = title;
        if (description !== undefined) updateFields.description = description;
        if (dueDate !== undefined) updateFields.dueDate = dueDate;
        if (priority !== undefined) updateFields.priority = priority;

        const updatedTodo = await Todo.updateOne(
            { _id: id },
            { $set: updateFields }
        )
        generateResponse(
            res,
            HttpStatus.OK,
            'Todo successfully updated',
            updatedTodo
        )
    } catch (err) {
        console.error(`[${new Date().toISOString()}]`, err)
        generateResponse(
            res,
            err?.status || HttpStatus.BadRequest,
            err?.message
        )
    }
}

export const complete = async (req, res) => {
    const { id } = req.body
    try {

        const updatedTodo = await Todo.updateOne(
            { _id: id },
            {
                $set:
                {
                    completed: true
                }
            }
        )
        generateResponse(
            res,
            HttpStatus.OK,
            'Todo completed',
            updatedTodo
        )
    } catch (err) {
        console.error(`[${new Date().toISOString()}]`, err)
        generateResponse(
            res,
            err?.status || HttpStatus.BadRequest,
            err?.message
        )
    }
}