import express from 'express'
import userRoutes from './routes/user.routes.js'
import connectionDataBase from './utils/connectDB.js'

const app = express()
const PORT = 8080 || process.env.PORT

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/users', userRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    connectionDataBase()
})