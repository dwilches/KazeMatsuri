import React, { useEffect, useRef } from "react";

interface ModalDialogProps {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

export const ModalDialog = ({ children, isOpen, onClose }: ModalDialogProps) => {

    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (!dialogRef.current) {
            return;
        }

        if (isOpen) {
            dialogRef.current.showModal();
        } else {
            dialogRef.current.close();
        }
    }, [isOpen]);

    return (
        <dialog ref={ dialogRef }
                id="modal-dialog"
                onClose={ onClose }>
            { children }
        </dialog>
    );
};
