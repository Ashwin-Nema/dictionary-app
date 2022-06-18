import './index.css';
import { Header, WordsListComponent, AddNewWordModal } from './components'
import { useState } from 'react'
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

function App() {
  const [modal, showmodal] = useState(false)
  const showMainModal = () => {
    showmodal(true)
  }
  return (
    <div >
      <Header />
      <WordsListComponent />
      <div className='fixedfloatingicon'>
        <Fab onClick={showMainModal} color="secondary" aria-label="add">
          <AddIcon />
        </Fab>

        <AddNewWordModal modal={modal} showmodal={showmodal} />
      </div>
    </div>
  );
}

export default App;
