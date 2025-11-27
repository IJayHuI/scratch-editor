/*
NOTE: this file only temporarily resides in scratch-gui.
Nearly identical code appears in scratch-www, and the two should
eventually be consolidated.
*/

import classNames from 'classnames';
import {FormattedMessage} from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import MenuBarMenu from './menu-bar-menu.jsx';
import MenuItemContainer from '../../containers/menu-item.jsx';
import UserAvatar from './user-avatar.jsx';
import dropdownCaret from './dropdown-caret.svg';

import styles from './account-nav.css';

const AccountNavComponent = ({
    className,
    isOpen,
    isRtl,
    menuBarMenuClassName,
    onClick,
    onClose,
    profileUrl,
    myStuffUrl,
    avatarUrl,
    myClassesUrl,
    username
}) => (
    <React.Fragment>
        <div
            className={classNames(
                styles.userInfo,
                className
            )}
            onClick={onClick}
        >
            {avatarUrl ? (
                <UserAvatar
                    className={styles.avatar}
                    imageUrl={avatarUrl}
                />
            ) : null}
            <span className={styles.profileName}>
                {username}
            </span>
            <div className={styles.dropdownCaretPosition}>
                <img
                    className={styles.dropdownCaretIcon}
                    src={dropdownCaret}
                />
            </div>
        </div>
        <MenuBarMenu
            className={menuBarMenuClassName}
            open={isOpen}
            // note: the Rtl styles are switched here, because this menu is justified
            // opposite all the others
            place={isRtl ? 'right' : 'left'}
            onRequestClose={onClose}
        >
            <MenuItemContainer href={profileUrl}>
                <FormattedMessage
                    defaultMessage="Profile"
                    description="Text to link to my user profile, in the account navigation menu"
                    id="gui.accountMenu.profile"
                />
            </MenuItemContainer>

            {myStuffUrl ? (
                <MenuItemContainer href={myStuffUrl}>
                    <FormattedMessage
                        defaultMessage="My Stuff"
                        description="Text to link to list of my projects, in the account navigation menu"
                        id="gui.accountMenu.myStuff"
                    />
                </MenuItemContainer>
            ) : null}

            {myClassesUrl ? (
                <MenuItemContainer href={myClassesUrl}>
                    <FormattedMessage
                        defaultMessage="My Classes"
                        description="Text to link to my classes (if I am a teacher), in the account navigation menu"
                        id="gui.accountMenu.myClasses"
                    />
                </MenuItemContainer>
            ) : null}
        </MenuBarMenu>
    </React.Fragment>
);

AccountNavComponent.propTypes = {
    className: PropTypes.string,

    isOpen: PropTypes.bool,
    isRtl: PropTypes.bool,

    menuBarMenuClassName: PropTypes.string,

    onClick: PropTypes.func,
    onClose: PropTypes.func,

    username: PropTypes.string,

    avatarUrl: PropTypes.string,
    myStuffUrl: PropTypes.string,
    myClassesUrl: PropTypes.string,
};

export default AccountNavComponent;
