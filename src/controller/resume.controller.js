const resumeService = require('../service/resume.service')

class ResumeController {
    findAllResumes = async (req, res) => {
        try {
            const orderKey = req.query.orderKey ?? 'resumeId'
            const orderValue = req.query.orderValue ?? 'desc'

            if (!['resumeId', 'status'].includes(orderKey)) {
                return res.status(400).json({
                    success: false,
                    message: 'orderKey 가 올바르지 않습니다.',
                })
            }

            if (!['asc', 'desc'].includes(orderValue.toLowerCase())) {
                return res.status(400).json({
                    success: false,
                    message: 'orderValue 가 올바르지 않습니다.',
                })
            }

            // database 영역 - service를 통해서 respository 접근하셈
            const resumes = await resumeService.findAllSortedResumes({
                orderKey,
                ordervalue: orderValue.toLowerCase(),
            })

            return res.json({ data: resumes })
        } catch (err) {
            return res.status(err.code).json(err)
        }
    }

    findOneResume = async (req, res) => {
        try {
            const resumeId = req.params.resumeId
            if (!resumeId) {
                return res.status(400).json({
                    success: false,
                    message: 'resumeId는 필수값입니다.',
                })
            }

            const resume = await resumeService.findOneResumeByResumeId(resumeId)

            if (!resume) {
                return res.json({ data: {} })
            }

            return res.json({ data: resume })
        } catch (err) {
            return res.status(err.code).json(err)
        }
    }

    createResume = async (req, res) => {
        try {
            const user = res.locals.user
            const { title, content } = req.body
            if (!title) {
                return res.status(400).json({
                    success: false,
                    message: '이력서 제목은 필수값 입니다',
                })
            }

            await resumeService.createResume({
                title,
                content,
                userId: user.userId,
            })

            if (!content) {
                return res.status(400).json({
                    success: false,
                    message: '자기소개는 필수값 입니다',
                })
            }

            return res.status(201).end()
        } catch (err) {
            return res.status(err.code).json(err)
        }
    }

    updateResume = async (req, res) => {
        try {
            const user = res.locals.user
            const resumeId = req.params.resumeId
            const { title, content, status } = req.body

            if (!resumeId) {
                return res.status(400).json({
                    success: false,
                    message: 'resumeId 는 필수값입니다',
                })
            }

            if (!title) {
                return res.status(400).json({
                    success: false,
                    message: '이력서 제목은 필수값입니다',
                })
            }

            if (!content) {
                return res.status(400).json({
                    success: false,
                    message: '자기소개는 필수값입니다',
                })
            }

            if (!status) {
                return res.status(400).json({
                    success: false,
                    message: '상태값은 필수값입니다',
                })
            }

            // status 는 존재
            if (
                ![
                    'APPLY',
                    'DROP',
                    'PASS',
                    'INTERVIEW1',
                    'INTERVIEW2',
                    'FINAL_PASS',
                ].includes(status)
            ) {
                return res.status(400).json({
                    success: false,
                    message: '올바르지 않은 상태값 입니다.',
                })
            }

            await resumeService.updateResumeByResumeId(
                resumeId,
                { title, content, status },
                user
            )

            return res.status(201).end()
        } catch (err) {
            return res.status(err.code).json(err)
        }
    }

    deleteResume = async (req, res) => {
        try {
            const user = res.locals.user
            const resumeId = req.params.resumeId

            if (!resumeId) {
                return res.status(400).json({
                    success: false,
                    message: 'resumeId 는 필수값입니다',
                })
            }

            await resumeService.deleteResumeByResumeId(resumeId, user)

            return res.status(201).end()
        } catch (err) {
            return res.status(err.code).json(err)
        }
    }
}

const resumeController = new ResumeController()
module.exports = resumeController
