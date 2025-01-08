/*
    The Icon Getter Utility
    -----------------------
*/

import * as BsIcons from 'react-icons/bs';
import * as FaIcons from 'react-icons/fa6';


const GetIcon = (directory, prefix, icon, props) => {
    const Icon = directory[`${prefix}${icon}`];

    if (Icon) {
        return <Icon {...props} />;
    } else {
        return '';
    };
};


export const GetBsIcon = (icon, props) => {
    return GetIcon(BsIcons, 'Bs', icon, props)
};

export const GetFaIcon = (icon, props) => {
    return GetIcon(FaIcons, 'Fa', icon, props)
};
