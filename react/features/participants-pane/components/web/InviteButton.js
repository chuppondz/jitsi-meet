// @flow

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

import { createToolbarEvent, sendAnalytics } from "../../../analytics";
import { Icon, IconInviteMore } from "../../../base/icons";
import { beginAddPeople } from "../../../invite";

import { ParticipantInviteButton } from "./styled";

import infoConf from "../../../../../infoConference";


export const InviteButton = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();

    const onInvite = useCallback(() => {
        sendAnalytics(createToolbarEvent("invite"));
        dispatch(beginAddPeople());
    }, [dispatch]);
    const typemeet = infoConf.getService();
    const typeOption = infoConf.getVoice();

    console.log(typemeet, 'typemeet=>>>>>>')
    console.log(typeOption,'typeOption=>>>>>')

    return (
        <div>
            {typemeet.service == "onemeet" && typeOption.option.audio == true ? (
                <div style={{ display: "none" }}>
                    <ParticipantInviteButton
                        aria-label={t("participantsPane.actions.invite")}
                        onClick={onInvite}
                    >
                        <Icon size={20} src={IconInviteMore} />
                        <span>{t("participantsPane.actions.invite")}</span>
                    </ParticipantInviteButton>
                </div>
            ) : (
                <ParticipantInviteButton
                    aria-label={t("participantsPane.actions.invite")}
                    onClick={onInvite}
                >
                    <Icon size={20} src={IconInviteMore} />
                    <span>{t("participantsPane.actions.invite")}</span>
                </ParticipantInviteButton>
            )}
        </div>
    );
};
