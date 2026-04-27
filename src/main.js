import {
    setShowConfigSettingsDialogHandler,
    setShowUnifiedSettingsDialogHandler,
    setUpdateCountersHandler,
} from './features/toolbar/index.js';
import {
    setCloseConfigOverlayHandler,
    showUnifiedSettingsDialog,
    updateCounters,
} from './features/settings/index.js';
import {
    closeCurrentConfigOverlay,
    showConfigSettingsDialog,
} from './features/configuration/index.js';
import { setupInitialization } from './bootstrap/initialization.js';

setShowUnifiedSettingsDialogHandler(showUnifiedSettingsDialog);
setShowConfigSettingsDialogHandler(showConfigSettingsDialog);
setUpdateCountersHandler(updateCounters);
setCloseConfigOverlayHandler(closeCurrentConfigOverlay);

setupInitialization();
