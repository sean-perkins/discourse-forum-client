import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Frame from '../components/Frame';

export class HomePage extends React.Component<RouteComponentProps<any>, void> {

    render() {
        return (
            <Frame />
        );
    }
}

export default (HomePage as any as React.StatelessComponent<RouteComponentProps<any>>);
