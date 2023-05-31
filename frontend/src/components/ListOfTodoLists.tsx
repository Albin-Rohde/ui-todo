import AddIcon from '@mui/icons-material/Add';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, List, ListItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import React from 'react';

import SecondaryButton from './SecondaryButton';

const ListOfTodoLists = () => {
  return (
    <>
      <List>
        <ListItem button>
          <ListItemText primary="Fixa bilen inför semester"/>
          <ListItemIcon>
            <Tooltip title="List is private">
              <VisibilityOffIcon/>
            </Tooltip>
          </ListItemIcon>
        </ListItem>
        <ListItem button>
          <ListItemText primary="Dessis studentfest"/>
        </ListItem>
        <ListItem button>
          <ListItemText primary="Handla nästa vecka"/>
        </ListItem>
      </List>
      <Box marginLeft={1} marginRight={1} width="calc(100% - 1rem)">
        <SecondaryButton
          variant="contained"
          color="primary"
          startIcon={<AddIcon/>}
          onClick={() => null}
          fullWidth
          sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
        >
          Create New List
        </SecondaryButton>
      </Box>
    </>
  );
};

export default ListOfTodoLists;
