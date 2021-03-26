// @flow
import type { Dispatch } from 'redux';

import { pinParticipant } from '../base/participants';

import {
    SET_FILMSTRIP_ITEMS_RENDERED,
    SET_HORIZONTAL_VIEW_DIMENSIONS,
    SET_TILE_VIEW_DIMENSIONS,
    SET_VERTICAL_VIEW_DIMENSIONS
} from './actionTypes';
import { SCROLL_SIZE, TILE_HORIZONTAL_MARGIN, TILE_VERTICAL_MARGIN } from './constants';
import {
    calculateThumbnailSizeForHorizontalView,
    calculateThumbnailSizeForTileView,
    calculateThumbnailSizeForVerticalView
} from './functions';

/**
 * Sets the dimensions of the tile view grid.
 *
 * @param {Object} dimensions - Whether the filmstrip is visible.
 * @param {Object | Function} stateful - An object or function that can be
 * resolved to Redux state using the {@code toState} function.
 * @returns {Function}
 */
export function setTileViewDimensions(dimensions: Object) {
    return (dispatch: Dispatch<any>, getState: Function) => {
        const state = getState();
        const { clientHeight, clientWidth } = state['features/base/responsive-ui'];
        const { disableResponsiveTiles } = state['features/base/config'];
        const {
            height,
            width
        } = calculateThumbnailSizeForTileView({
            ...dimensions,
            clientWidth,
            clientHeight,
            disableResponsiveTiles
        });
        const { columns, rows } = dimensions;
        const thumbnailsTotalHeight = rows * (TILE_VERTICAL_MARGIN + height);
        const hasScroll = clientHeight < thumbnailsTotalHeight;
        const filmstripWidth = (columns * (TILE_HORIZONTAL_MARGIN + width)) + (hasScroll ? SCROLL_SIZE : 0);
        const filmstripHeight = Math.min(clientHeight, thumbnailsTotalHeight);

        dispatch({
            type: SET_TILE_VIEW_DIMENSIONS,
            dimensions: {
                gridDimensions: dimensions,
                thumbnailSize: {
                    height,
                    width
                },
                filmstripHeight,
                filmstripWidth
            }
        });
    };
}

/**
 * Sets the dimensions of the thumbnails in vertical view.
 *
 * @returns {Function}
 */
export function setVerticalViewDimensions() {
    return (dispatch: Dispatch<any>, getState: Function) => {
        const state = getState();
        const { clientHeight = 0, clientWidth = 0 } = state['features/base/responsive-ui'];
        const thumbnails = calculateThumbnailSizeForVerticalView(clientWidth);

        dispatch({
            type: SET_VERTICAL_VIEW_DIMENSIONS,
            dimensions: {
                ...thumbnails,
                remoteVideosContainer: {
                    // 2px for border + 2px margin for left and right + 7px for scroll
                    width: thumbnails?.local?.width + 15,
                    height: clientHeight - thumbnails?.local?.height - 60
                }
            }

        });
    };
}

/**
 * Sets the dimensions of the thumbnails in horizontal view.
 *
 * @returns {Function}
 */
export function setHorizontalViewDimensions() {
    return (dispatch: Dispatch<any>, getState: Function) => {
        const state = getState();
        const { clientHeight = 0, clientWidth = 0 } = state['features/base/responsive-ui'];
        const thumbnails = calculateThumbnailSizeForHorizontalView(clientHeight);

        dispatch({
            type: SET_HORIZONTAL_VIEW_DIMENSIONS,
            dimensions: {
                ...thumbnails,
                remoteVideosContainer: {
                    // 39px for margins, borders, paddings and the hide filmstrip icon
                    width: clientWidth - thumbnails?.local?.width - 39,
                    height: thumbnails?.local?.height + 14 // margin + borders
                }
            }
        });
    };
}

/**
 * Emulates a click on the n-th video.
 *
 * @param {number} n - Number that identifies the video.
 * @returns {Function}
 */
export function clickOnVideo(n: number) {
    return (dispatch: Function, getState: Function) => {
        const participants = getState()['features/base/participants'];
        const nThParticipant = participants[n];
        const { id, pinned } = nThParticipant;

        dispatch(pinParticipant(pinned ? null : id));
    };
}

/**
 *
 * @param {number} startIndex
 * @param {number} endIndex
 */
export function setFilmstripItemsRendered(startIndex, endIndex) {
    return {
        type: SET_FILMSTRIP_ITEMS_RENDERED,
        startIndex,
        endIndex
    };
}

export * from './actions.native';
