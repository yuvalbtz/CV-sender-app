import { Avatar, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useState } from 'react'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { supabase } from '../utility/supabaseClient';
import CircularProgress from '@mui/material/CircularProgress';
import {GrDocumentPdf, GrDocumentWord} from 'react-icons/gr'

function MyCvs({user}) {
   const [list, setList] = useState(null)
   const [loading, setLoading] = useState(false)
   const [checked, setChecked] = useState([1])
    

  

    useEffect(() => {
      let isApiSubscribed = true;
      
      supabase.storage.from(`documents`).list(`${user.id}`,{
        sortBy: {column:'created_at', order:"desc" }})
      .then((res) =>{
        supabase
        .from('users')
        .select(`job_position, jobMailInfo`)
        .match({user_id:user.id})
        .order('id', { ascending: false })
        .then((data) => {
          if (res.data.length === 0) return setList([])
          res.data.map((itemName, i) => {
            const { publicURL, error } =  supabase
            .storage
            .from('documents')
            .getPublicUrl(`${user.id}/${itemName.name}`)
            itemName.url = publicURL
            if(data.data.length > 0){
              itemName.title = data.data[i].job_position
              itemName.type = data.data[i].jobMailInfo.fileType
            }
            })
             
            if(data.data.length > 0){
                setList(res.data) 
              }
             
              if(loading){
                setList(res.data)
              }
             
            
            
            console.log('render',res.data);
        })        
      }).catch((err) => console.log(err))

     
       return () => {
        isApiSubscribed = false
       

       }
    },[loading])

   



    function handleRemoveCv(item){ 
    setLoading(true) 
    const currentIndex = checked.indexOf(item);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(item);
    } 
    
    setChecked(newChecked);
    
      supabase.storage.from(`documents`)
       .remove([`${user.id}/${item.name}`])
       .then((res) => {
        supabase
        .from('users')
        .delete()
        .match({user_id:user.id,job_position:item.title})
        .then((res) => {
          console.log(res.status)
          setLoading(false)
        })
        .catch((err) => console.log(err))
       })
       .catch((err) => console.log(err))
   
      }



    return (

   <Grid textAlign={'center'} item xs={12} md={6}>
            <List dense={true}>
              {list ? (list.map((item) => 
                <ListItem
                key={item.id}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleRemoveCv(item)} aria-label="delete">
                   {(loading && checked.indexOf(item) !== -1) ? <CircularProgress size={20} /> :  <DeleteIcon />}
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                   {item.type === 'pdf' ?  <GrDocumentPdf className='pdfIcon' /> : <GrDocumentWord className='wordIcon'/> }
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={`${item.title}`}
                  secondary={<><a target="_blank" rel="noreferrer" href={item.url}>{`${item.name}`}</a></>}
                />
              </ListItem>
              )) : (
                <CircularProgress
                thickness={2}  
              />)}
            </List>
           {list && list.length === 0 && ( 
           <Typography variant='p'>
              Your CVs are empty.
           </Typography>)}
        </Grid>
  )
}

export default MyCvs