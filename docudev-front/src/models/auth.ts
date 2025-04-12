export interface User {
	_id: string
	name: string
	surname: string
	email: string
	password?: string
	token: string
	image?: string
	role: 'admin' | 'user'
	phone?: string
	code?: string
	status: 'active' | 'inactive' | 'suspended'
	teams?: string[]
}

export type UserFormPayload = Pick<User, 'email' | 'password'>
export type UserRegisterPayload = Pick<User, 'name' | 'surname' | 'email' | 'password'>
export type UserNewPasswordPayload = Pick<User, 'email' | 'password' | 'code'>

export interface NewPasswordFormValues {
	password: string
	confirmPassword: string
}
