import React, {
  forwardRef,
  ForwardRefRenderFunction,
  Fragment,
  useImperativeHandle,
  useState,
} from "react";
import UserDetailModal from "./UserDetailModal";

interface UserDetailInstanceProps {}

export interface UserDetailInstanceMessage {
  address: string;
}

const UserDetailInstance: ForwardRefRenderFunction<any, any> = (
  props: UserDetailInstanceProps,
  ref: any
) => {
  const [messages, setMessages] = useState<UserDetailInstanceMessage[]>([]);

  useImperativeHandle(ref, () => ({
    addModal: (msg: UserDetailInstanceMessage) => {
      setMessages((messages) => {
        return [...messages, msg];
      });
    },
  }));

  const onDismiss = (index: number) => {
    // eslint-disable-next-line prefer-const
    let newMessages = [...messages];
    newMessages.splice(index, 1);
    setMessages((messages) => {
      const newMessages = [...messages];
      newMessages.splice(index, 1);
      return newMessages;
    });
  };

  if (messages.length === 0) {
    return <div />;
  }

  return (
    <Fragment>
      {messages.map((item, index) => {
        const { address } = item;

        return (
          <UserDetailModal
            handleClose={() => {
              onDismiss(index);
            }}
            address={address}
          />
        );
      })}
    </Fragment>
  );
};

export default forwardRef(UserDetailInstance);
