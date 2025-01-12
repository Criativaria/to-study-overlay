import './style.css'
import paper from './assets/paper.jpg'
import { Square, SquareCheckBig, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export type Task = {
    label: string,
    state: boolean
}
const storageKey = "TASKS_STORAGE"

export function ToDo() {
    const [inputValue, setInputValue] = useState("");
    const [Tasks, setTasks] = useState<Task[]>([])
    const [podeNao, setPodeNao] = useState(true)

    useEffect(() => {
        const allTasks = localStorage.getItem(storageKey)
        const parseTasks = JSON.parse(allTasks!)
        setTasks(parseTasks ?? [])
    }, [])

    useEffect(() => {
        if (Tasks.length > 0) {

            localStorage.setItem(storageKey, JSON.stringify(Tasks))
        }
    }, [Tasks])

    function AddTask(e: React.KeyboardEvent<HTMLInputElement>) {

        if (e.key === 'Enter') {

            if (Tasks.length == 0 && inputValue != "") {
                saveTasks(inputValue)
                setInputValue("")
            } else {
                Tasks.forEach((task: Task) => {
                    if (task.label == inputValue || inputValue == "") {
                        setPodeNao(false)
                        setInputValue("")
                        return
                    } else {
                        if (inputValue.length < 20) {
                            saveTasks(inputValue)
                            setInputValue("")
                        } else {
                            setPodeNao(false)
                            return
                        }
                    }
                })
            }
        }
    }

    function RemoveTask(taskname: string) {
        const filtredTasks = Tasks.filter((task: Task) => task.label != taskname);

        setTasks(filtredTasks)

        if (Tasks.length === 1) {
            localStorage.removeItem(storageKey)
        }
    }

    function toggleTask(taskname: string) {

        const toggledTask: Task[] = Tasks.map((task: Task) => {
            if (taskname == task.label) {
                task.state = !task.state
            }
            return task;
        })
        setTasks(toggledTask)
    }

    async function saveTasks(task: string) {

        const updatedTasks = [...Tasks, { label: task, state: false }];
        setTasks(updatedTasks)
    }

    return (
        <div className="wrapper">
            <p className='main-title'>To-Study:</p>

            <div className='main-content'>
                <div className='tasks'>
                    {
                        Tasks.map((task: Task) =>
                            <div className='task'>

                                {task.state ?
                                    <>
                                        <SquareCheckBig size={20} color="#1b1a1a" onClick={() => toggleTask(task.label)} />
                                        <p style={{ textDecorationLine: 'line-through' }}>{task.label}</p>
                                    </>
                                    :
                                    <>
                                        <Square size={20} color="#1b1a1a" onClick={() => toggleTask(task.label)} />
                                        <p>{task.label}</p>
                                    </>
                                }


                                <Trash2 size={20} color="#fbb1b1" onClick={() => RemoveTask(task.label)} />
                            </div>
                        )
                    }
                </div>


                <div className='add-task'>
                    <input className='input' type="text" onChange={e => setInputValue(e.target.value)} value={inputValue} onKeyDown={e => AddTask(e)} maxLength={20} />
                </div>

                {podeNao ||
                    <div className='podenao'>
                        <p>não pode</p>
                        <X size={20} color="#1b1a1a" onClick={() => setPodeNao(true)} />
                    </div>}
            </div>

            <img className='paper-img' src={paper} alt="" />
        </div>
    )

}