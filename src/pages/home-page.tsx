import {
  Badge,
  Box,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  Modal,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SearchIcon from "@mui/icons-material/Search";
import Avatar from "@mui/material/Avatar";
import { useState } from "react";

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

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      <Box display={"flex"} justifyContent={"space-between"} height={"100vh"}>
        <Box
          width={"25%"}
          border={1}
          borderColor={"red"}
          bgcolor={(theme) => theme.palette.grey[50]}
          px={1}
        >
          <Box
            display={"flex"}
            justifyContent={"space-around"}
            alignItems={"center"}
            bgcolor={(theme) => theme.palette.background.paper}
            borderRadius={2}
            padding={1}
          >
            {/* <Typography
              color={(theme) => theme.palette.grey[800]}
              fontWeight={600}
              fontSize={20}
            >
              Chat
            </Typography> */}
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
            <IconButton onClick={handleOpen}>
              <AddCircleIcon color="primary" sx={{ fontSize: 30 }} />
            </IconButton>
          </Box>
          {/* Friends List */}
          <Box bgcolor={(theme) => theme.palette.grey[50]} px={1}>
            <Typography
              component={"h2"}
              variant="h6"
              fontWeight={600}
              color={(theme) => theme.palette.grey[800]}
            >
              Friends
            </Typography>
            <Box sx={{ overflowY: "auto", height: "100vh" }}>
              <Stack direction="column" divider={<Divider />}>
                {[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((element) => {
                  return (
                    <Box
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
                      }}
                    >
                      <Avatar
                        {...stringAvatar("Abhinav Singh")}
                        sx={{ mr: 1 }}
                      />
                      <Box
                        display={"flex"}
                        flexDirection={"column"}
                        width={"100%"}
                      >
                        <Box
                          display={"flex"}
                          justifyContent={"space-between"}
                          sx={{ border: "1px solid red" }}
                        >
                          <Typography
                            component={"span"}
                            fontWeight={600}
                            color={(theme) => theme.palette.grey[800]}
                          >
                            Abhinav Singh
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
                          sx={{ border: "1px solid green" }}
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
                })}
              </Stack>
            </Box>
          </Box>
        </Box>
        <Box width={"75%"} border={1} borderColor={"green"}></Box>
      </Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
}
