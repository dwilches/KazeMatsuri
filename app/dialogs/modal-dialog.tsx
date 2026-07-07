import React, { useEffect, useRef } from "react";

interface ModalDialogProps {
    id: string;
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

export const ModalDialog = ({ id, children, isOpen, onClose }: ModalDialogProps) => {

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
                id={ id }
                onClose={ onClose }>
            { children }
        </dialog>
    );
};
