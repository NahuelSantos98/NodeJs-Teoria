import {Router} from 'express'
import {userModel} from '../models/user.model.js'

const UserRouter = Router()

UserRouter.get('/', async(req, res) => {
    try {
        let users = await userModel.find()
        res.status(200).json({status: 'success', data: users})
    } catch (e) {
        console.error(e);
        res.status(500).json({error: 'Error al obtener los usuarios'})
    }
})

UserRouter.post('/', async(req, res) => {
    try {
        let user = await userModel.create(req.body)
        res.status(201).json({status: 'success', data: user})
    } catch (e) {
        console.error(e);
        res.status(500).json({error: 'Error al crear el usuario'})
    }
})

UserRouter.put('/:id', async(req, res) => {
    try {
        let user = await userModel.findByIdAndUpdate(req.params.id, req.body)
        res.status(200).json({status: 'success', data: user})
    } catch (e) {
        console.error(e);
        res.status(500).json({error: 'Error al actualizar el usuario'})
    }
})

UserRouter.delete('/:id', async(req, res) => {
    try {
        let user = await userModel.findByIdAndDelete(req.params.id)
        res.status(200).json({status: 'success', data: user})
    } catch (e) {
        console.error(e);
        res.status(500).json({error: 'Error al eliminar el usuario'})
    }
})

export default UserRouter