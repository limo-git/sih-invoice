'use client';

import PropTypes from 'prop-types';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import React from 'react';

const SwaggerDoc = ({ spec }:any) => (
  <SwaggerUI spec={spec} />
);

SwaggerDoc.propTypes = {
  spec: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default SwaggerDoc;
