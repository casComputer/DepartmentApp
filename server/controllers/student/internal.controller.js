import Internal from '../../models/internalMark.js'

export const getInternalMarks = async (req, res)=> {
    try {
        const {
            role
        } = req.user

        const {
            sem,
            course
        } = req.body

        if (role !== 'student') return res.json({
            success: false, message: 'UnAutherized access!'
        })

        const internals = await Internal.find({
            sem, course
        })

        res.json({
            success: true, internals
        })

    }catch(e) {
        console.log('Error while fetching internal marks: ', e)
        res.json({
            success: false, message: 'Internal Server Error!'
        })
    }
}