const sha256 = require('crypto-js/sha256')
const jwtwebToken = require('jsonwebtoken')

const userRepository = require('../repository/user.repository')

class UserService {
    userSignUp = async (data) => {
        const { email, clientId, password, name, grade } = data

        // clientId (kakao)
        if (clientId) {
            const user = await userRepository.selectOneUserByClientId(clientId)

            if (user) {
                throw {
                    code: 400,
                    message: '이미 가입된 사용자 입니다.',
                }
            }

            await userRepository.createUser({ clientId, name, grade })
        } else {
            const user = await userRepository.selectOneUserByEmail(email)

            if (user) {
                throw {
                    code: 400,
                    message: '이미 가입된 이메일 입니다.',
                }
            }

            await userRepository.createUser({
                email,
                password: sha256(password).toString(),
                name,
                grade,
            })
        }
    }

    userSignIn = async ({ clientId, email, password }) => {
        let user
        if (clientId) {
            // 카카오 로그인
            user = await userRepository.selectOneUserByClientId(clientId)

            if (!user) {
                throw {
                    code: 401,
                    message: '올바르지 않은 로그인 정보입니다.',
                }
            }
        } else {
            // email 로그인
            if (!email) {
                throw { code: 400, message: '이메일은 필수값입니다.' }
            }

            if (!password) {
                throw { code: 400, message: '비밀번호는 필수값입니다.' }
            }

            user = await userRepository.selectOneUserByEmailAndPassword(
                email,
                sha256(password).toString()
            )

            if (!user) {
                throw {
                    code: 401,
                    message: '올바르지 않은 로그인 정보입니다.',
                }
            }
        }

        // 로그인 성공
        const accessToken = jwtwebToken.sign(
            { userId: user.userId },
            'resume@#',
            {
                expiresIn: '12h',
            }
        )
        const refreshToken = jwtwebToken.sign(
            { userId: user.userId },
            'resume&%*',
            { expiresIn: '7d' }
        )
        return {
            accessToken,
            refreshToken,
        }
    }
}

const userService = new UserService()
module.exports = userService
