import { createStyles, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() =>
    createStyles({
        selectorComponent: {
            "& .MuiSelect-root": {
                minWidth: "100px",
            },
            "& .MuiOutlinedInput-input": {
                padding: "5px 30px 5px 5px",
            },
        },
        inputComponent: {
            marginLeft: "8px",
            fontSize: "8px",
            "& .MuiOutlinedInput-input": {
                padding: "5px 6px 5px 5px",
            },
            "& .MuiOutlinedInput-adornedEnd": {
                paddingRight: "8px",
            },
            '& [data-shrink="false"].MuiInputLabel-outlined': {
                transform: "translate(14px, 6px) scale(0.9)",
            },
        },
        categoryContainer: {
            marginTop: 20,
        },
        categoryTitle: {
            textTransform: "capitalize",
            marginBottom: 10,
        },
        noComponents: {
            display: "flex",
            height: "90vh",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 16,
        },
        componentContainer: {
            display: "flex",
            flexWrap: "wrap",
        },
    })
);

export default useStyles;

