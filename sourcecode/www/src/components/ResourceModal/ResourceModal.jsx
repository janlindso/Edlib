import React from 'react';
import {
    ArrowForward,
    Edit as EditIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import _ from 'lodash';
import { useResourceCapabilities } from '../../contexts/ResourceCapabilities';
import useResourceCapabilitiesFlags from '../../hooks/useResourceCapabilities';
import ResourcePreview from '../../containers/ResourcePreview';
import License from '../License';
import moment from 'moment';
import useTranslation from '../../hooks/useTranslation';
import { useHistory } from 'react-router-dom';
import { resourceCapabilities } from '../../config/resource';
import { useEdlibComponentsContext } from '../../contexts/EdlibComponents';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    DialogContent,
    DialogActions,
    DialogTitle,
    IconButton,
    Typography,
    Dialog,
    Grid,
} from '@mui/material';
import { makeStyles } from 'tss-react/mui';
import { ResourceIcon } from '../Resource';
import { useIframeStandaloneContext } from '../../contexts/IframeStandalone';
import ResourceStats from './ResourceStats.jsx';
import { useConfigurationContext } from '../../contexts/Configuration.jsx';

const useStyles = makeStyles()((theme) => ({
    dialogTitle: {
        margin: 0,
        padding: theme.spacing(2),
        display: 'flex',
        justifyContent: 'space-between',
    },
    dialogActions: {
        margin: 0,
        padding: theme.spacing(1),
    },
    closeButton: {
        color: theme.palette.grey[500],
    },
    dialog: {
        // height: '100%',
        // maxHeight: '70vh',
    },
    footer: {
        marginTop: 30,
        display: 'flex',
        fontSize: '1rem',
        fontWeight: '400 !important',
    },
    createdAt: {
        fontSize: '0.875rem',
        fontWeight: '400 !important',
    },
    meta: {
        marginRight: 20,
        '& > div:first-child': {
            fontWeight: '400',
            textTransform: 'none',
            marginBottom: 15,
        },
    },
    alertBox: {
        marginRight: theme.spacing(1),
    },
    title: {
        fontSize: '1.125rem',
        fontWeight: '400 !important',
    },
    titleURL: {
        fontSize: '0.875rem',
        fontWeight: '400 !important',
    },
}));

const ResourceModal = ({ isOpen, onClose, resource }) => {
    const { classes } = useStyles();
    const { t } = useTranslation();
    const history = useHistory();
    const { getUserConfig } = useEdlibComponentsContext();
    const { getPath } = useIframeStandaloneContext();
    const canReturnResources = getUserConfig('canReturnResources');
    const { www } = useConfigurationContext();

    const [actionStatus, setActionStatus] = React.useState({
        loading: false,
        error: false,
    });
    const { onInsert } = useResourceCapabilities();

    const insertResource = React.useCallback(async () => {
        setActionStatus({
            loading: true,
            error: false,
        });

        await onInsert(
            resource.id,
            resource.version.id,
            resource.version.title
        );
    }, [onInsert, setActionStatus, resource]);

    const editResource = React.useCallback(() => {
        history.push(getPath(`/resources/${resource.id}`));
        onClose();
    }, [resource]);

    const capabilities = useResourceCapabilitiesFlags(resource);
    const canEdit = capabilities[resourceCapabilities.EDIT];

    return (
        <Dialog
            maxWidth="lg"
            fullWidth
            onClose={onClose}
            open={isOpen}
            classes={{
                paperScrollPaper: classes.dialog,
            }}
        >
            <DialogTitle className={classes.dialogTitle}>
                <Box display="flex" alignItems="center">
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                    >
                        <ResourceIcon
                            contentTypeInfo={resource.contentTypeInfo}
                            fontSizeRem={2}
                        />
                    </Box>
                    <Box>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            marginLeft={1}
                        >
                            <Typography variant="h6" className={classes.title}>
                                {resource.version.title}
                            </Typography>
                        </Box>
                        {resource.version.isPublished &&
                            <Box display="flex" marginLeft={1}>
                                <Typography className={classes.titleURL}>
                                    <a
                                        href={www(`/s/resources/${resource.id}`)}
                                        target="_blank"
                                    >
                                        {www(`/s/resources/${resource.id}`)}
                                    </a>
                                </Typography>
                            </Box>
                        }
                    </Box>
                </Box>
                {onClose ? (
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="center"
                    >
                        <IconButton
                            aria-label="close"
                            className={classes.closeButton}
                            onClick={onClose}
                            size="large"
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                ) : null}
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={1}>
                    <Grid item lg={7} xs={12}>
                        <ResourcePreview resource={resource}>
                            {({ loading, error, frame }) => {
                                if (loading) {
                                    return (
                                        <div
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                padding: '20px 0',
                                            }}
                                        >
                                            <CircularProgress />
                                        </div>
                                    );
                                }

                                if (error) {
                                    return <div>{t('something_happened')}</div>;
                                }

                                return (
                                    <>
                                        <div>{frame}</div>
                                        <div className={classes.footer}>
                                            <div className={classes.meta}>
                                                <div>{t('created')}</div>
                                                <div className={classes.createdAt}>
                                                    {moment(resource.version.createdAt).format('LL')}
                                                </div>
                                            </div>
                                            <div className={classes.meta}>
                                                <div>{t('license')}</div>
                                                <div>
                                                    <License
                                                        license={
                                                            resource.version
                                                                .license
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                );
                            }}
                        </ResourcePreview>
                    </Grid>
                    <Grid item lg={5} xs={12}>
                        <ResourceStats resourceId={resource.id} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions classes={{ root: classes.dialogActions }}>
                {!canEdit &&
                    <Alert severity="info" className={classes.alertBox}>
                        {t('edit_not_allowed_by_license')}
                    </Alert>
                }
                <Button
                    color="primary"
                    variant="contained"
                    onClick={canEdit ? editResource : null}
                    startIcon={<EditIcon />}
                    disabled={!canEdit}
                >
                    {t('Rediger ressurs')}
                </Button>
                {canReturnResources && (
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={insertResource}
                        startIcon={<ArrowForward />}
                    >
                        {t('Bruk ressurs')}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default (props) => {
    if (!props.isOpen) {
        return <></>;
    }

    return <ResourceModal {...props} />;
};
