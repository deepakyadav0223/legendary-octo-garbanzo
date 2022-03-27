import ModelLoadStatus from "./ModelLoadStatus";
import ModelLoading from "./ModelLoading";
import { UploadFromWebcam } from "./UploadFromWebcam";
import { Card, Col, Form, Row, Select } from "antd";
import React, { useEffect, useState } from "react";

import {
  isFaceDetectionModelLoaded,
  isFacialLandmarkDetectionModelLoaded,
  isFeatureExtractionModelLoaded,
  loadModels,
} from "./index";

let DEFAULT_UPLOAD_OPTION = 'From Webcam';
let UPLOAD_OPTION = ['From Webcam'];

const { Option } = Select;

export default ({ galleryRefetch, countRefetch }) => {
  const [selectedUploadOption, setSelectedUploadOption] = useState(
    DEFAULT_UPLOAD_OPTION
  );

  const [isAllModelLoaded, setIsAllModelLoaded] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [loadingMessageError, setLoadingMessageError] = useState("");

//   const [addFacePhotoCallback, { loading }] = useMutation(
//     ADD_FACE_PHOTO_MUTATION,
//     {
//       onError(err) {
//         CheckError(err);
//       },
//     }
//   );

  const handleSelectUploadOption = (value) => {
    setSelectedUploadOption(value);
  };

  useEffect(() => {
    async function loadingtheModel() {
      await loadModels(setLoadingMessage, setLoadingMessageError);
      setIsAllModelLoaded(true);
    }
    if (
      !!isFaceDetectionModelLoaded() &&
      !!isFacialLandmarkDetectionModelLoaded() &&
      !!isFeatureExtractionModelLoaded()) {
      setIsAllModelLoaded(true);
      return;
    }

    loadingtheModel();
  }, [isAllModelLoaded]);

  return (
    <Card>
      <Card title="Model Load">
        <ModelLoadStatus errorMessage={loadingMessageError} />
      </Card>
      <br />
      {!isAllModelLoaded ? (
        <ModelLoading loadingMessage={loadingMessage} />
      ) : loadingMessageError ? (
        <div className="error">{loadingMessageError}</div>
      ) : (
        isAllModelLoaded &&
        loadingMessageError.length === 0 && (
          <div>
              <Form>
                <Form.Item label="Upload Option">
                  <Select
                    defaultValue={DEFAULT_UPLOAD_OPTION}
                    style={{ width: 200 }}
                    onChange={handleSelectUploadOption}
                  >
                    {UPLOAD_OPTION.map((op) => (
                      <Option key={op} value={op}>
                        {op}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Form>

                {
                  <UploadFromWebcam
                    // addFacePhotoCallback={addFacePhotoCallback}
                    galleryRefetch={galleryRefetch}
                    countRefetch={countRefetch}
                    // loading={loading}
                  />
                }

        
        </div>))}
    </Card>
  );
};