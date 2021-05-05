import { Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add';
import React from 'react'
import { useHistory } from 'react-router-dom'

const CreatepostButton = () => {
    const history = useHistory()
    return (
        <div className='createpost_home'>

            <Fab onClick={() => { history.push('/create') }} color="secondary" aria-label="add">
                <AddIcon />
            </Fab>

        </div>

    )
}

export default CreatepostButton
