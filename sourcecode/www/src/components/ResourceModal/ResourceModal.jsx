import React from 'react';
import { Spinner } from '@cerpus/ui';
import {
    ArrowForward,
    Edit as EditIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import styled from 'styled-components';
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
    Box,
    Button,
    DialogContent,
    DialogActions as MuiDialogActions,
    DialogTitle as MuiDialogTitle,
    IconButton,
    Typography,
    Dialog,
    Grid,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import { ResourceIcon } from '../Resource';
import useConfig from '../../hooks/useConfig.js';
import { useIframeStandaloneContext } from '../../contexts/IframeStandalone';
import ResourceStats from './ResourceStats.jsx';

const Footer = styled.div`
    margin-top: 30px;
    display: flex;
`;

const Meta = styled.div`
    margin-right: 20px;
    & > div {
        &:first-child {
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 15px;
        }
    }
`;

const useStyles = makeStyles((theme) => ({
    dialogTitle: {
        margin: 0,
        padding: theme.spacing(2),
        display: 'flex',
        justifyContent: 'space-between',
    },
    closeButton: {
        color: theme.palette.grey[500],
    },
    dialog: {
        // height: '100%',
        // maxHeight: '70vh',
    },
}));

const DialogActions = withStyles((theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(1),
    },
}))(MuiDialogActions);

const ResourceModal = ({ isOpen, onClose, resource }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const history = useHistory();
    const { getUserConfig } = useEdlibComponentsContext();
    const { getPath } = useIframeStandaloneContext();
    const canReturnResources = getUserConfig('canReturnResources');
    const { edlibFrontend } = useConfig();

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
            <MuiDialogTitle disableTypography className={classes.dialogTitle}>
                <Box display="flex">
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
                            <Typography variant="h6">
                                {resource.version.title}
                            </Typography>
                        </Box>
                        <Box display="flex" marginLeft={1}>
                            <Typography>
                                <a
                                    href={edlibFrontend(
                                        `/s/resources/${resource.id}`
                                    )}
                                    target="_blank"
                                >
                                    {edlibFrontend(
                                        `/s/resources/${resource.id}`
                                    )}
                                </a>
                            </Typography>
                        </Box>
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
            </MuiDialogTitle>
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
                                            <Spinner />
                                        </div>
                                    );
                                }

                                if (error) {
                                    return <div>Noe skjedde</div>;
                                }

                                return (
                                    <>
                                        <div>{frame}</div>
                                        <Footer>
                                            <Meta>
                                                <div>
                                                    {_.capitalize(
                                                        t('publishing_date')
                                                    )}
                                                </div>
                                                <div>
                                                    {moment(
                                                        resource.version
                                                            .createdAt
                                                    ).format('D. MMMM YYYY')}
                                                </div>
                                            </Meta>
                                            <Meta>
                                                <div>
                                                    {_.capitalize(t('license'))}
                                                </div>
                                                <div>
                                                    <License
                                                        license={
                                                            resource.version
                                                                .license
                                                        }
                                                    />
                                                </div>
                                            </Meta>
                                        </Footer>
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
            <DialogActions>
                {capabilities[resourceCapabilities.EDIT] && (
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={editResource}
                        startIcon={<EditIcon />}
                    >
                        {t('Rediger ressurs').toUpperCase()}
                    </Button>
                )}
                {canReturnResources && (
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={insertResource}
                        startIcon={<ArrowForward />}
                    >
                        {t('Bruk ressurs').toUpperCase()}
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
