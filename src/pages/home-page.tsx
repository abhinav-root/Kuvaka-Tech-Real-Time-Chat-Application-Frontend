import {
  Badge,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  LinearProgress,
  Modal,
  OutlinedInput,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import Avatar from "@mui/material/Avatar";
import React, { useEffect, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "../api/axios";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface IFriend extends IUser {
  lastMessage: string;
}

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => {
    setModalOpen(false);
    setUsers([]);
  };
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [friends, setFriends] = useState<IFriend[]>([]);
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<IFriend | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const getAllFriends = async () => {
    try {
      setFriendsLoading(true);
      const response = await axios.get("/users/friends");
      setFriends(response.data);
    } catch (err) {
      console.log(err);
      setSnackbarMessage("Error loading friends");
      setSnackbarOpen(true);
    } finally {
      setTimeout(() => setSnackbarOpen(false), 2000);
      setFriendsLoading(false);
    }
  };

  useEffect(() => {
    getAllFriends();
  }, []);

  async function searchUsers() {
    try {
      setIsLoading(true);
      setUsers([]);
      const response = await axios.get("/users", { params: { q: search } });
      setUsers(response.data);
    } catch (err) {
      console.log(err);
      setSnackbarMessage("Error searching users");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
      setTimeout(() => setSnackbarOpen(false), 2000);
    }
  }

  useEffect(() => {
    if (search) {
      searchUsers();
    } else {
      setUsers([]);
    }
  }, [search]);

  async function addFriend(_id: string) {
    try {
      const response = await axios.post("/users/friends", { friendId: _id });
      const { friend } = response.data;
      setFriends((prev) => [...prev, friend]);
      searchUsers();
      setSnackbarMessage("Friend added");
      setSnackbarOpen(true);
    } catch (err) {
      console.log(err);
      setSnackbarMessage("Error occured while adding friend");
      setSnackbarOpen(true);
    } finally {
      setTimeout(() => setSnackbarOpen(false), 2000);
    }
  }

  async function removeFriend(_id: string) {
    try {
      setSelectedFriend(null);
      setDialogOpen(false)
      await axios.delete(`/users/friends/${_id}`);
      getAllFriends();
      setSnackbarMessage("Chat Deleted");
      setSnackbarOpen(true);
      setTimeout(() => setSnackbarOpen(false), 2000);
    } catch (err) {
      console.log(err);
      setSnackbarMessage("Error occured while deleting chat");
      setSnackbarOpen(true);
    } finally {
      setTimeout(() => setSnackbarOpen(false), 2000);
    }
  }

  return (
    <Box>
      <Box display={"flex"} justifyContent={"space-between"} height={"100vh"}>
        {/* Friend List */}
        <Box
          width={"25%"}
          border={1}
          borderColor={"red"}
          // bgcolor={(theme) => theme.palette.grey[50]}
          sx={{ overflowY: "auto" }}
        >
          <Box
            display={"flex"}
            justifyContent={"space-around"}
            alignItems={"center"}
            bgcolor={(theme) => theme.palette.background.paper}
            px={1}
            py={2}
            borderBottom={1}
            mb={2}
          >
            <FormControl size="small">
              <OutlinedInput
                sx={{ borderRadius: 5 }}
                placeholder="Search"
                // id="outlined-adornment-amount"
                endAdornment={
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                }
              />
            </FormControl>
            <IconButton onClick={handleModalOpen}>
              <AddCircleIcon color="primary" sx={{ fontSize: 30 }} />
            </IconButton>
          </Box>
          {/* Friends List */}
          <Box bgcolor={(theme) => theme.palette.background.paper} px={1}>
            <Typography
              component={"h2"}
              variant="h6"
              fontWeight={600}
              color={(theme) => theme.palette.grey[800]}
            >
              Friends ({friends.length})
            </Typography>
            {friendsLoading && (
              <Box my={2} textAlign={"center"}>
                <CircularProgress />
              </Box>
            )}
            <Box>
              <Stack direction="column" divider={<Divider />}>
                {!friendsLoading && friends.length === 0 ? (
                  <Typography
                    my={2}
                    fontWeight={500}
                    textAlign={"center"}
                    color={(theme) => theme.palette.grey[600]}
                  >
                    Add friends to start chatting
                  </Typography>
                ) : (
                  friends.map((friend) => {
                    return (
                      <Box
                        onClick={() => setSelectedFriend(friend)}
                        display={"flex"}
                        bgcolor={(theme) => theme.palette.background.paper}
                        py={2}
                        px={1}
                        borderRadius={2}
                        sx={{
                          ":hover": {
                            cursor: "pointer",
                            backgroundColor: (theme) => theme.palette.grey[200],
                          },
                          backgroundColor:
                            selectedFriend?._id === friend?._id
                              ? (theme) => theme.palette.grey[200]
                              : "none",
                        }}
                      >
                        <Avatar
                          {...stringAvatar(
                            friend.firstName + " " + friend.lastName
                          )}
                          sx={{ mr: 1, textTransform: "capitalize" }}
                        />
                        <Box
                          display={"flex"}
                          flexDirection={"column"}
                          width={"100%"}
                        >
                          <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                          >
                            <Typography
                              component={"span"}
                              fontWeight={600}
                              color={(theme) => theme.palette.grey[800]}
                              textTransform={"capitalize"}
                            >
                              {friend.firstName + " " + friend.lastName}
                            </Typography>
                            <Typography
                              color={(theme) => theme.palette.grey[600]}
                              fontSize={13}
                              component={"span"}
                            >{`3:02 PM`}</Typography>
                          </Box>
                          <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                          >
                            <Typography
                              component={"span"}
                              color={(theme) => theme.palette.grey[600]}
                              fontSize={14}
                            >
                              Hello, how are you today?
                            </Typography>
                            <Box component={"span"}>
                              <Badge
                                badgeContent={10}
                                max={9}
                                color="primary"
                                sx={{ ml: -1.5 }}
                              ></Badge>
                            </Box>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })
                )}
              </Stack>
            </Box>
          </Box>
        </Box>
        {/* Selected Friend Chat */}

        {!selectedFriend ? (
          <Box
            width={"75%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography
              fontSize={20}
              color={(theme) => theme.palette.grey[700]}
            >
              Select a chat to start messaging
            </Typography>
          </Box>
        ) : (
          <Box
            width={"75%"}
            border={1}
            borderColor={"green"}
            sx={{ overflowY: "auto" }}
          >
            <Box
              display={"flex"}
              alignItems={"center"}
              px={4}
              py={2}
              boxShadow={2}
            >
              <Avatar sx={{ mr: 2, height: 45, width: 45 }} />
              <Typography
                fontWeight={700}
                fontSize={20}
                textTransform={"capitalize"}
                flexGrow={1}
              >
                {selectedFriend?.firstName + " " + selectedFriend?.lastName}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<DeleteIcon />}
                color="error"
                onClick={() => setDialogOpen(true)}
              >
                Delete Chat
              </Button>
            </Box>
          </Box>
        )}
      </Box>
      <Modal
        open={modalOpen}
        onClose={() => {handleModalClose(); setUsers([])}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 3,
            boxShadow: 24,
            py: 1,
            px: 2,
            maxHeight: "80vh",
            overflowY: "auto"
          }}
        >
          <Box my={2} textAlign={"right"}>
            <Button
              variant="contained"
              color="error"
              onClick={handleModalClose}
            >
              Close
            </Button>
          </Box>
          <FormControl size="small" fullWidth>
            <OutlinedInput
              sx={{
                borderRadius: 3,
                bgcolor: (theme) => theme.palette.grey[100],
              }}
              placeholder="Search users"
              onChange={(e) => setSearch(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              }
            />
          </FormControl>
          <Box py={2}>
            {isLoading && <LinearProgress />}
            {!isLoading && search && users.length === 0 && (
              <Typography
                textAlign={"center"}
                color={(theme) => theme.palette.grey[600]}
              >
                No users found
              </Typography>
            )}
            <Stack direction="column" divider={<Divider />}>
              {users.map((user) => {
                return (
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    py={1}
                    justifyContent={"space-between"}
                    
                  >
                    <Box display={"flex"} alignItems={"center"}>
                      <Avatar src="/broken-image.jpg" sx={{ mr: 1 }} />
                      <Typography
                        fontWeight={600}
                        fontSize={18}
                        textTransform={"capitalize"}
                        color={(theme) => theme.palette.grey[900]}
                      >
                        {user.firstName + " " + user.lastName}
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<PersonAddIcon />}
                      onClick={() => addFriend(user._id)}
                    >
                      Add
                    </Button>
                  </Box>
                );
              })}
            </Stack>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleModalClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
      <React.Fragment>
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete chat?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              All the chats with this person will be permanently deleted
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => removeFriend(selectedFriend?._id)}
              autoFocus
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </Box>
  );
}
