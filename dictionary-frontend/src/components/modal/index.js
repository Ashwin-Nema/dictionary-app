
import { Modal, Alert } from 'react-bootstrap'
import { useState, useRef } from 'react'
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import ErrorRoundedIcon from '@mui/icons-material/ErrorRounded';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { convertFileToBase64URL } from '../../utils'
import { BASEURL } from '../../config'
export const AddNewWordModal = (props) => {

    const { modal, showmodal } = props
    const [alertVariant, setalertVariant] = useState("success")
    const [alertMessage, SetalertMessage] = useState("")
    const [alertModal, showAlertModal] = useState(false)
    const [wordname, setwordname] = useState("")
    const [category, setCategory] = useState("")
    const [definiton, setDefinition] = useState("")
    const [example, setExample] = useState("")
    const [origin, setOrigin] = useState("")
    const pronunciation = useRef()

    const AlertModal = ({ variant, message, onhide, showmodal }) => {

        return (
            <>
                <Modal contentClassName="modalwithoutcolor" show={showmodal} onHide={() => onhide(false)}>
                    <Alert variant={variant} >
                        <div className="d-flex justify-content-center">
                            <h5>
                                {
                                    variant !== "danger" ?
                                        <>
                                            <div className="d-flex flex-column">
                                                <div className="d-flex justify-content-center">
                                                    <CheckCircleIcon style={{ color: "green" }} />
                                                </div>

                                                <div >
                                                    {message}
                                                </div>
                                            </div>
                                        </>
                                        :
                                        <>
                                            <div className="row">
                                                <div className="col-1"><ErrorRoundedIcon style={{ color: "red" }} /> </div>
                                                <div className="col-10">
                                                    <h5>{message}</h5>

                                                </div>
                                            </div>
                                        </>
                                }

                            </h5>
                        </div>
                    </Alert>
                </Modal>
            </>
        )
    }

    const openModalWithVariantAndMessage = (variant, message) => {
        setalertVariant(variant)
        SetalertMessage(message)
        showAlertModal(true)

    }
    const savenewWord = async (e) => {
        e.preventDefault()
        if (wordname.trim() === "") {
            openModalWithVariantAndMessage("danger", "Please provide a word name")
            return
        }

        if (category.trim() === "") {
            openModalWithVariantAndMessage("danger", "Please provide a category name")
            return
        }

        if (definiton.trim() === "") {
            openModalWithVariantAndMessage("danger", "Please provide a definiton name")
            return
        }

        if (example.trim() === "") {
            openModalWithVariantAndMessage("danger", "Please provide an example name")
            return
        }

        if (pronunciation.current && pronunciation.current.files.length > 0) {
            const selectedfile = pronunciation.current.files[0]
            const { size, type } = selectedfile
            if (!type.includes("audio")) {
                openModalWithVariantAndMessage("danger", "File provided is not of audio type")
                return
            }
            const sizeLimit = 5242880 // 5 MB
            if (size > sizeLimit) {
                openModalWithVariantAndMessage("danger", "File provided exceeds maximum file size of 5 MB")
                return 
            }
        }
        let wordData
        wordData = { name: wordname, category: { categoryname: category, definitons: [definiton], examples:[example] } }
        if (origin.trim().length > 0) {
            wordData.category.origin = [origin]
        }

        if (pronunciation.current && pronunciation.current.files.length > 0) {
            const base64audiofile = await convertFileToBase64URL(pronunciation.current.files[0])
            wordData.category.pronunciation = base64audiofile
        }
   
        try {
            const uploadeddataJSON = await fetch(`${BASEURL}/word/add`, {
                method: "post", body: JSON.stringify(wordData), headers: {
                    'Content-Type': 'application/json'
                }
            })
            const uploadeddataresponse = await uploadeddataJSON.json()
            const {message} = uploadeddataresponse
            if (message.includes("success")) {
                openModalWithVariantAndMessage("success", "Word added successfully")
            } else {
                openModalWithVariantAndMessage("danger", "Word is already present in database")
            }
        } catch (error) {
            openModalWithVariantAndMessage("danger", "Sorry something went wrong")
        }

    }



    return (
        <>
            <AlertModal variant={alertVariant} message={alertMessage} onhide={showAlertModal} showmodal={alertModal} />

            <Modal className='mt-3' centered show={modal} contentClassName="modalwithoutcolor" onHide={() => showmodal(false)}>
            <div className="d-flex justify-content-center mt-5 mb-3">
                <CancelRoundedIcon className="closeeditingbutton " onClick={() => showmodal(false)} />
            </div>
            <Alert className='bg-white text-dark'>
                <h5 className="mb-3 text-center">Add Word  </h5>

                <form onSubmit={savenewWord}>
                    <div>
                        <label className="form-label">Word</label>
                    </div>
                    <input value={wordname} onChange={(e) => setwordname(e.target.value)} className="modalinput mb-3" type="text" />

                    <div>
                        <label className="form-label">Category</label>
                    </div>
                    <input value={category} onChange={(e) => setCategory(e.target.value)} className="modalinput mb-3" type="text" />

                    <div>
                        <label className="form-label">Definition</label>
                    </div>

                    <input value={definiton} onChange={(e) => setDefinition(e.target.value)} className="modalinput mb-3" type="text" />

                    <div>
                        <label className="form-label">Example</label>
                    </div>
                    <input value={example} onChange={(e) => setExample(e.target.value)} className="modalinput mb-3" type="text" />

                    <div>
                        <label className="form-label">Origin</label>
                    </div>

                    <input value={origin} onChange={(e) => setOrigin(e.target.value)} className="modalinput mb-3" type="text" />
                    <div>
                        <label className="form-label">Pronunciation</label>
                    </div>

                    <input ref={pronunciation} className="modalinput mb-3 border-none" type="file" />


                    <div type="submit" className="d-flex justify-content-center mt-2">
                        <button className="btn purplebackground text-white w-75 rounded-pill">Save changes</button>
                    </div>
                </form>


            </Alert>
        </Modal>

        </>
    )
}