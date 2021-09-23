import React, { Component } from "react";
import PropTypes from "prop-types";
import IconButton from "@material-ui/core/IconButton";
import withStyles from "@material-ui/core/styles/withStyles";
import allicons, {ViewGridPlus, DownloadCircleOutline} from "mdi-material-ui";
import PencilIcon from "mdi-material-ui/Pencil";
import CloseIcon from "mdi-material-ui/Close";
import SortableTree, { removeNodeAtPath } from "react-sortable-tree";
import "react-sortable-tree/style.css";
import ConfirmDialog from "@reactioncommerce/catalyst/ConfirmDialog";
import SortableTheme from "./SortableTheme";

const styles = (theme) => ({
  wrapper: {
    width: "100%",
    height: `calc(100vh - ${theme.mixins.toolbar.minHeight}px)`
  },
  btntext: {
    fontSize: "0.71rem",
    marginLeft: "-5px",
    marginRight: "10px"
  }
});

class NavigationTreeContainer extends Component {

  constructor(props) {
    super(props);
    this.state = { hidden: true };
  }

  static propTypes = {
    classes: PropTypes.object,
    navigationTreeRows: PropTypes.array,
    onClickUpdateNavigationItem: PropTypes.func,
    onDragHover: PropTypes.func,
    onSetOverNavigationItemId: PropTypes.func,
    onSetSortableNavigationTree: PropTypes.func,
    onToggleChildrenVisibility: PropTypes.func,
    overNavigationItemId: PropTypes.string,
    sortableNavigationTree: PropTypes.arrayOf(PropTypes.object)
  }

  static defaultProps = {
    onSetSortableNavigationTree() { }
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ hidden: false });
    }, 500);
    console.log("icons", allicons)
  }

  getNodeKey = ({ treeIndex }) => treeIndex;

  generateNodeProps = ({ node, path }) => {
    const { onClickUpdateNavigationItem, onSetSortableNavigationTree, sortableNavigationTree, classes} = this.props;

    const addProduct = (item, obj) => {
        console.log("item", item.draftData.url);
        console.log("sortableNavigationTree", sortableNavigationTree);

        function findNestedObj(entireObj, keyToFind, valToFind) {
          let foundObj;
          JSON.stringify(entireObj, (_, nestedValue) => {
            if (nestedValue && nestedValue[keyToFind] === valToFind) {
              foundObj = nestedValue;
            }
            return nestedValue;
          });
          return foundObj;
        };

        console.log("finding..", findNestedObj(sortableNavigationTree, 'subtitle', item.draftData.url));
    }

    return {
      buttons: [
        <div>
        <IconButton
        onClick={() => {
          addProduct(node.navigationItem, {
            getNodeKey: this.getNodeKey,
            node,
            path,
            treeData: sortableNavigationTree
          });
        }}
      >
        <DownloadCircleOutline />
      </IconButton>
      <span className={classes.btntext}>100</span>
      </div>,
        <IconButton
          onClick={() => {
            addProduct(node.navigationItem, {
              getNodeKey: this.getNodeKey,
              node,
              path,
              treeData: sortableNavigationTree
            });
          }}
        >
          <ViewGridPlus />
        </IconButton>,
        <IconButton
          onClick={() => {
            onClickUpdateNavigationItem(node.navigationItem, {
              getNodeKey: this.getNodeKey,
              node,
              path,
              treeData: sortableNavigationTree
            });
          }}
        >
          <PencilIcon />
        </IconButton>,
        <ConfirmDialog
          ButtonComponent={IconButton}
          openButtonContent={<CloseIcon />}
          title={"Remove this navigation item?"}
          onConfirm={() => {
            const newSortableNavigationTree = removeNodeAtPath({
              treeData: sortableNavigationTree,
              path,
              getNodeKey: this.getNodeKey
            });
            onSetSortableNavigationTree(newSortableNavigationTree);
          }}
        >
          {({ openDialog }) => (
            <IconButton onClick={openDialog}>
              <CloseIcon />
            </IconButton>
          )}
        </ConfirmDialog>
      ]
    };
  }

  render() {
    const { classes, onSetSortableNavigationTree, sortableNavigationTree } = this.props;
    return (
      this.state.hidden ? '' :
        <div className={classes.wrapper}>
          <SortableTree
            reactVirtualizedListProps={{
              style: {
                paddingTop: "50px",
                boxSizing: "border-box"
              },
              containerStyle: {
                position: "relative",
                overflow: "visible"
              }
            }}
            generateNodeProps={this.generateNodeProps}
            treeData={sortableNavigationTree || []}
            maxDepth={10}
            onChange={onSetSortableNavigationTree}
            theme={SortableTheme}
            dndType={"CARD"}
          />
        </div>
    );
  }
}

export default withStyles(styles, { name: "RuiNavigationTreeContainer" })(NavigationTreeContainer);
