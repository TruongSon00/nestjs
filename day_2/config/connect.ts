import { connect } from 'mongoose';

export default function Connect(): void {
    connect(process.env.URL_DATABASE)
        .then(() => console.log('=====  connect succesfully  ====='))
        .catch((err) => console.log({ err }))
}