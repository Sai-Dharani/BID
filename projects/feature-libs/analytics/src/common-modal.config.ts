import { DIALOG_TYPE, LayoutConfig } from '@spartacus/storefront';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { LAUNCH_CALLER } from './modal-launch-caller.config';
import { ConfirmationModalComponent } from './components/shared/confirmation-modal/confirmation-modal.component';

export const commonModalConfig: LayoutConfig = {
    launch: {
        [LAUNCH_CALLER.GENERAL_MODAL_POPUP]: {
            inlineRoot: true,
            component: OrderDetailsComponent,
            dialogType: DIALOG_TYPE.DIALOG,
        },
        [LAUNCH_CALLER.CONFIRMATION_MODAL_POPUP]: {
            inlineRoot: true,
            component: ConfirmationModalComponent,
            dialogType: DIALOG_TYPE.DIALOG,
        },
    },
};