// import { useState } from 'react';
// import { Modal, List, ListItem, ListItemText } from '@mui/material';

// function FollowerFollowingModal({ user, type }) {
//   const [open, setOpen] = useState(false);

//   const handleOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <>
//       <Modal open={open} onClose={handleClose}>
//         <List>
//           {user[type] && user[type].map((item) => (
//             <ListItem key={item.id}>
//               <ListItemText primary={item.name} secondary={item.username} />
//             </ListItem>
//           ))}
//         </List>
//       </Modal>
//     </>
//   );
// }

// export default FollowerFollowingModal
