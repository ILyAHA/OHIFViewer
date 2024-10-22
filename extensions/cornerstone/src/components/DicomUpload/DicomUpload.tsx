import React, { useCallback, useState } from 'react';
import { ReactElement } from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import DicomFileUploader from '../../utils/DicomFileUploader';
import DicomUploadProgress from './DicomUploadProgress';
import { Button, ButtonEnums } from '@ohif/ui';
import './DicomUpload.css';

type DicomUploadProps = {
  dataSource;
  onComplete: () => void;
  onStarted: () => void;
};

function DicomUpload({
  dataSource,
  onComplete,
  onStarted,
}: DicomUploadProps): ReactElement {
  const { t } = useTranslation('UploadModal');
  const baseClassNames = 'min-h-[480px] flex flex-col bg-black select-none';
  const [dicomFileUploaderArr, setDicomFileUploaderArr] = useState([]);

  const onDrop = useCallback(async acceptedFiles => {
    onStarted();
    setDicomFileUploaderArr(acceptedFiles.map(file => new DicomFileUploader(file, dataSource)));
  }, []);

  const getDropZoneComponent = (): ReactElement => {
    return (
      <Dropzone
        onDrop={acceptedFiles => {
          onDrop(acceptedFiles);
        }}
        noClick
      >
        {({ getRootProps }) => (
          <div
            {...getRootProps()}
            className="dicom-upload-drop-area-border-dash m-5 flex h-full flex-col items-center justify-center"
          >
            <div className="flex gap-3">
              <Dropzone
                onDrop={onDrop}
                noDrag
                accept=".zip"
              >
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()}>
                    <Button
                      disabled={false}
                      onClick={() => {}}
                    >
                      {t('Add zip files')}
                      <input {...getInputProps()} />
                    </Button>
                  </div>
                )}
              </Dropzone>
              {/* <Dropzone
                onDrop={onDrop}
                noDrag
              >
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()}>
                    <Button
                      type={ButtonEnums.type.secondary}
                      disabled={false}
                      onClick={() => {}}
                    >
                      {t('Add folder')}
                      <input
                        {...getInputProps()}
                        webkitdirectory="true"
                        mozdirectory="true"
                      />
                    </Button>
                  </div>
                )}
              </Dropzone> */}
            </div>
            <div className="pt-5">{t('or drag zip files here')}</div>
            <div className="text-aqua-pale pt-3 text-lg">{t('DICOM, nrrd files supported')}</div>
          </div>
        )}
      </Dropzone>
    );
  };

  return (
    <>
      {dicomFileUploaderArr.length ? (
        <div className={classNames('h-[calc(100vh-300px)]', baseClassNames)}>
          <DicomUploadProgress
            dicomFileUploaderArr={Array.from(dicomFileUploaderArr)}
            onComplete={onComplete}
          />
        </div>
      ) : (
        <div className={classNames('h-[480px]', baseClassNames)}>{getDropZoneComponent()}</div>
      )}
    </>
  );
}

DicomUpload.propTypes = {
  dataSource: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired,
  onStarted: PropTypes.func.isRequired,
};

export default DicomUpload;
