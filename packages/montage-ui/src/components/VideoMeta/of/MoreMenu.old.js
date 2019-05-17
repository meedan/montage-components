import {
  bindHover,
  bindMenu,
  usePopupState
} from "material-ui-popup-state/hooks";
import { includes } from "lodash";

import Button from "@material-ui/core/Button";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

const ParentPopupState = React.createContext(null);

class MoreMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdding: false,
      newCollectionName: ""
    };
  }

  render() {
    const { isArchived, collections, inCollections } = this.props;

    const popupState = usePopupState({
      popupId: "MoreMenu",
      variant: "popover"
    });

    const createCollection = () => {
      this.setState({ isAdding: false });
      // setIsAddingCollection(false);
      console.group("createCollection()"); // TODO: make the API call here
      console.log(`collectionName: ${this.state.newCollectionName}`);
      console.groupEnd();
      // props.enqueueSnackbar(`${newCollectionName} collection created`);
    };
    const cancelCreateCollection = () => {
      this.setState({ isAdding: false });
      // setIsAddingCollection(false);
    };
    const addToCollection = (collectionId, collectionName) => {
      console.group("addToCollection()"); // TODO: make the API call here
      console.log(`mediaId: ${id}`);
      console.log(`collectionId: ${collectionId}`);
      console.groupEnd();
      // props.enqueueSnackbar(`Video added to ${collectionName}`);
    };
    const removeFromCollection = (collectionId, collectionName) => {
      console.group("removeFromCollection()"); // TODO: make the API call here
      console.log(`mediaId: ${id}`);
      console.log(`collectionId: ${collectionId}`);
      console.groupEnd();
      // props.enqueueSnackbar(`Video removed from ${collectionName}`);
    };
    const removeFromLibrary = () => {
      console.group("removeFromLibrary()"); // TODO: make the API call here and probably do re-routing
      console.log(`mediaId: ${id}`);
      console.groupEnd();
      setIsRemovingVideo(false);
      // props.enqueueSnackbar("Video removed from the Library");
    };
    const openDuplicatesModal = () => {
      popupState.close();
      console.group("openDuplicatesModal()"); // TODO: wire duplicates modal trigger here
      console.groupEnd();
    };

    return (
      <ListItem
        button={!this.state.isAdding}
        onClick={
          !this.state.isAdding ? () => this.setState({ isAdding: true }) : null
        }
        style={{ height: "auto" }}
      >
        <ListItemText>
          {this.state.isAdding ? (
            <Grid container direction="column" spacing={8} wrap="nowrap">
              <Grid item>
                <TextField
                  autoFocus
                  fullWidth
                  id="newCollectionName"
                  inputProps={{
                    autoComplete: "off"
                  }}
                  label="New collection…"
                  placeholder="Enter name"
                  required
                  type="text"
                  onChange={e =>
                    this.setState({
                      newCollectionName: e.currentTarget.value
                    })
                  }
                />
              </Grid>
              <Grid item>
                <Grid
                  container
                  direction="row-reverse"
                  justify="space-between"
                  wrap="nowrap"
                >
                  <Grid item>
                    <Button
                      color="primary"
                      disabled={this.state.newCollectionName.length === 0}
                      mini
                      onClick={createCollection}
                      size="small"
                    >
                      Create
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button mini onClick={cancelCreateCollection} size="small">
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            "New collection…"
          )}
        </ListItemText>
      </ListItem>
    );
  }
}
