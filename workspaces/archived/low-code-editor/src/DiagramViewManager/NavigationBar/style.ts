import { createStyles, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() =>
    createStyles({
        projectSelectorOption: {
            padding: 10,
            cursor: "pointer",
            "&:hover": {
                backgroundColor: "#e6e7ec",
            }
        },
        selectorComponent: {
            // margin: "0 10px",
            "& .MuiSelect-root": {
                minWidth: "100px"
            },
            "& .MuiOutlinedInput-input": {
                padding: "5px 30px 5px 5px"
            }
        },
        active: {
            cursor: "default",
            color: "textPrimary"
        },
        link: {
            cursor: "pointer"
        },
        breadcrumb: {
            "& .MuiBreadcrumbs-separator": {
                margin: "2px"
            },
            padding: "0 5px",
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        }
    })
)

export default useStyles;

