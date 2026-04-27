import { useState } from "react"
import { useToggleZone, useZones } from "../../../hooks/useZones";
import { ZoneTable } from "./ZoneTable";
import { ZoneFormModal } from "./ZoneFormModal";

export const ZonesPage = () => {
    // modal de création/modification d'une zone
    const [modalState, setModalState] = useState({
        open : false,
        zone : null
    });
    
    const {data: zones, isLoading, isError} = useZones();
    const toggleMutation = useToggleZone();

    const openCreate = () => setModalState({
        open : true,
        zone : null
    });

    const openEdit = (zone) => setModalState({
        open : true,
        zone
    });

    const closeModal = () => setModalState({
        open : false,
        zone : null
    });

    if(isLoading) return <div className="page-loading">Chargement...</div>;
    if(isError) return <div className="page-error">Erreur de chargement</div>;

    return (
        <div className="admin-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Zones de livraison</h1>
                    <p className="page-subtitle">
                        {zones?.length} zone{zones?.length !== 1 ? 's' : ''}
                        {' '}configurée{zones?.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button className="btn btn-orange" onClick={openCreate}>
                    + Nouvelle zone
                </button>
            </div>
            <ZoneTable
                zones = {zones || []}
                onEdit = {openEdit}
                onToggle = {(id) => toggleMutation.mutate(id)}
                toggleLoading = {toggleMutation.isPending} 
            />
            {
                modalState.open && (
                    <ZoneFormModal
                        zone = {modalState.zone}
                        onClose = {closeModal}
                    />
                )
            }
        </div>
    )


}