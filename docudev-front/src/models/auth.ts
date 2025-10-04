export interface User {
	_id: string
	name: string
	surname: string
	email: string
	password?: string
	image: File | string | null
	role: 'admin' | 'user'
	phone?: string
	code?: string
	status: 'active' | 'inactive' | 'suspended'
	createdAt: string
	updatedAt: string
}

export type UserFormPayload = Pick<User, 'email' | 'password'>
export type UserRegisterPayload = Pick<User, 'name' | 'surname' | 'email' | 'password'>
export type UserNewPasswordPayload = Pick<User, 'email' | 'password' | 'code'>
export type UserAccountPayload = Pick<User, 'name' | 'surname' | 'email' | 'image' | 'phone'>

export interface NewPasswordFormValues {
	password: string
	confirmPassword: string
}
