import { ToolbarPaper } from "./EditorElements";
import { makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

const languages = [
    'Python',
    'Java'
]

const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

function Tools (props: any) {
    const classes = useStyles();

    const handleChangeLanguage = (event: any) => {
        props.setToolProperties({
            ...props.toolProperties,
            language: event.target.value
        })
    }

    return (
        <ToolbarPaper elevation={2}>
            <FormControl className={classes.formControl}>
                <InputLabel htmlFor='editor-label'>Language</InputLabel>
                <Select
                    labelId="editor-label"
                    id="editor-label"
                    value={props.toolProperties.language}
                    onChange={handleChangeLanguage}
                    >
                {languages.map((language) => (
                    <MenuItem key={language} value={language}>
                    {language}
                    </MenuItem>
                ))}
                </Select>
            </FormControl>   
        </ToolbarPaper>
    )
}

export default Tools;