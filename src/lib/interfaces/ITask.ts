import type IStep from "./IStep"

export default interface ITask {
    name: string
    steps: IStep[]
    buttons: string[]
    keys: string[]
}