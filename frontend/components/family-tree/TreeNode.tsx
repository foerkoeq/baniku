// start of frontend/components/family-tree/TreeNode.tsx
'use client';
import React from 'react';
import Image from 'next/image';
import { TreeNodeProps, NodeClickData } from './types';
import IconChevronDown from '../icon/icon-chevron-down';
import IconInfo from '../icon/icon-info-circle';
import IconPlus from '../icon/icon-plus';
import IconEdit from '../icon/icon-edit';
import IconCalendar from '../icon/icon-calendar';
import IconLocation from '../icon/icon-map-pin';
import IconPhone from '../icon/icon-phone';
import ProfileImage from '../ui/ProfileImage';

const TreeNode: React.FC<TreeNodeProps> = ({ 
  nodeData, 
  onNodeClick, 
  foreignObjectProps,
  role 
}) => {
  // Ukuran node yang lebih besar untuk menampung informasi yang lebih lengkap
  const nodeSize = { x: 320, y: 200 };
  const imageSize = 70;
  
  // Cek tipe node
  const isPlaceholder = nodeData.nodeType === 'PLACEHOLDER' || nodeData.id?.startsWith('placeholder-');
  const isEmpty = nodeData.nodeType === 'EMPTY';
  const isRootTemplate = nodeData.id === 'root-template' || nodeData.id === 'root';

  // Tentukan warna dan style berdasarkan gender dan status
  const getNodeStyle = () => {
    // Placeholder kosong - abu-abu
    if (isPlaceholder || isEmpty) {
      return {
        border: 'border-dashed border-gray-300 dark:border-gray-700',
        background: 'bg-gray-50 dark:bg-gray-800/30',
        shadow: 'shadow-sm',
        accent: 'text-gray-500'
      };
    }
    
    // Cek jika sudah meninggal
    if (nodeData.status === 'DECEASED') {
      return {
        border: 'border-gray-400 dark:border-gray-600',
        background: 'bg-gray-100 dark:bg-gray-800/50',
        shadow: 'shadow-sm',
        accent: 'text-gray-600'
      };
    }
    
    // Berdasarkan gender
    switch (nodeData.gender) {
      case 'FEMALE':
        return {
          border: 'border-pink-500 dark:border-pink-600',
          background: 'bg-pink-50 dark:bg-pink-900/20',
          shadow: 'shadow-md shadow-pink-200/50 dark:shadow-pink-900/20',
          accent: 'text-pink-600 dark:text-pink-400'
        };
      case 'MALE':
        return {
          border: 'border-blue-500 dark:border-blue-600',
          background: 'bg-blue-50 dark:bg-blue-900/20',
          shadow: 'shadow-md shadow-blue-200/50 dark:shadow-blue-900/20',
          accent: 'text-blue-600 dark:text-blue-400'
        };
      default:
        return {
          border: 'border-purple-400 dark:border-purple-600',
          background: 'bg-purple-50 dark:bg-purple-900/20',
          shadow: 'shadow-sm',
          accent: 'text-purple-600 dark:text-purple-400'
        };
    }
  };

  // Cek apakah node bisa diedit berdasarkan role
  const canEdit = () => {
    if (isPlaceholder || isEmpty) return false;
    if (role === 'SUPER_ADMIN') return true;
    if ((role === 'ADMIN_BANI' || role === 'ADMIN_KELUARGA') && nodeData.level && nodeData.level > 1) return true;
    return false;
  };
  
  // Cek apakah user dapat menambahkan data baru pada node
  const canAddNew = () => {
    // Super admin bisa menambah di mana saja
    if (role === 'SUPER_ADMIN') return true;
    
    // Admin Bani bisa menambah di level tertentu
    if (role === 'ADMIN_BANI' && nodeData.level && nodeData.level > 0) return true;
    
    // Admin Keluarga hanya bisa menambah di level cabang keluarganya
    if (role === 'ADMIN_KELUARGA' && nodeData.level && nodeData.level > 1) return true;
    
    return false;
  };

  // Handle berbagai jenis klik
  const handleAction = (action: 'details' | 'expand' | 'add' | 'edit') => {
    console.log(`TreeNode: Handling action '${action}' for node:`, nodeData.id);
    onNodeClick({ 
      nodeData, 
      action 
    });
  };

  // Handle klik langsung pada node placeholder
  const handlePlaceholderClick = () => {
    if (canAddNew()) {
      console.log("Placeholder node clicked, triggering add action");
      handleAction('add');
    }
  };

  // Handle klik langsung pada node
  const handleNodeClick = () => {
    // Jika placeholder, maka tambah data
    if (isPlaceholder || isEmpty) {
      if (canAddNew()) {
        handleAction('add');
      }
      return;
    }
    
    // Jika root template, tergantung izin
    if (isRootTemplate && canAddNew()) {
      handleAction('add');
      return;
    }
    
    // Node biasa, tampilkan detail
    if (!isRootTemplate) {
      handleAction('details');
    }
  };

  // Format tanggal untuk ditampilkan
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  // Truncate text untuk tampilan yang lebih baik
  const truncateText = (text?: string, maxLength = 20) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Render node placeholder kosong secara berbeda
  if (isPlaceholder || isEmpty) {
    const nodeStyle = getNodeStyle();
    const isClickable = canAddNew();
    
    return (
      <g>
        <foreignObject
          {...foreignObjectProps}
          x={-nodeSize.x / 2}
          y={-nodeSize.y / 2}
          width={nodeSize.x}
          height={nodeSize.y}
        >
          <div 
            className={`h-full p-4 border-2 ${nodeStyle.border} rounded-lg ${nodeStyle.background} ${nodeStyle.shadow}
              ${isClickable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/30 hover:border-primary hover:border-[2.5px]' : ''} transition-all duration-200`}
            onClick={isClickable ? handlePlaceholderClick : undefined}
            style={{ pointerEvents: isClickable ? 'all' : 'none' }}
          >
            <div className="flex flex-col items-center justify-center h-full">
              {canAddNew() ? (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center mb-3 group-hover:bg-primary/20">
                    <IconPlus className="w-8 h-8 text-primary dark:text-primary-light" />
                  </div>
                  <span className="block text-sm font-medium text-center text-gray-700 dark:text-gray-300 mb-1">
                    Tambah Anggota Keluarga
                  </span>
                  <span className="block text-xs text-center text-gray-500 dark:text-gray-400">
                    Klik untuk menambahkan anggota keluarga baru
                  </span>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700/50 rounded-full mx-auto mb-3 flex items-center justify-center">
                    <IconInfo className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                  </div>
                  <span className="block text-sm font-medium text-center text-gray-600 dark:text-gray-300 mb-1">
                    Data Belum Tersedia
                  </span>
                  <span className="block text-xs text-center text-gray-500 dark:text-gray-400">
                    Menunggu admin untuk menambahkan data
                  </span>
                </div>
              )}
            </div>
          </div>
        </foreignObject>
      </g>
    );
  }

  // Style untuk node normal
  const nodeStyle = getNodeStyle();
  
  // Pastikan nodeData memiliki property yang dibutuhkan
  const nodeName = nodeData.fullName || nodeData.name || 'Unnamed';
  const nodeId = nodeData.id || 'unknown';
  const nodeGender = nodeData.gender || 'OTHER';

  // Informasi pasangan jika ada
  const hasSpouse = nodeData.spouses && nodeData.spouses.length > 0;
  const currentSpouse = hasSpouse && nodeData.spouses 
    ? nodeData.spouses.find(spouse => spouse.isCurrentSpouse) 
    : undefined;

  // Cek apakah node root template bisa diklik
  const isRootClickable = isRootTemplate && canAddNew();

  return (
    <g>
      <foreignObject
        {...foreignObjectProps}
        x={-nodeSize.x / 2}
        y={-nodeSize.y / 2}
        width={nodeSize.x}
        height={nodeSize.y}
      >
        <div 
          className={`h-full p-4 border-2 rounded-lg transition-all duration-200 
            ${nodeStyle.border} ${nodeStyle.background} ${nodeStyle.shadow}
            ${!canEdit() ? 'opacity-95' : ''}
            ${isRootClickable ? 'cursor-pointer hover:bg-blue-50/70 dark:hover:bg-blue-900/30 hover:border-primary hover:border-[2.5px]' : ''}
            ${isRootTemplate ? 'border-dashed' : ''}`}
          onClick={isRootClickable ? handleNodeClick : undefined}
          style={{ 
            pointerEvents: 'all' 
          }}
        >
          <div className="flex flex-col h-full">
            {/* Header dengan nama dan foto */}
            <div className="flex items-center space-x-3 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
              {/* Foto Profile */}
              <div className="relative">
                <ProfileImage
                  src={nodeData.photo}
                  alt={nodeName}
                  size={imageSize}
                  className={`rounded-full overflow-hidden border-3 
                    ${nodeGender === 'FEMALE' 
                      ? 'border-pink-400 dark:border-pink-600' 
                      : 'border-blue-400 dark:border-blue-600'}`}
                />
                
                {/* Indikator status */}
                {nodeData.status === 'DECEASED' && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center text-white text-xs">
                    ✝
                  </div>
                )}
              </div>
              
              {/* Nama dan title */}
              <div className="flex-1 min-w-0">
                <h4 
                  className="text-base font-semibold truncate cursor-pointer hover:underline" 
                  onClick={() => !isRootTemplate && handleNodeClick()}
                >
                  {nodeData.titlePrefix && <span className="text-gray-600 dark:text-gray-400 text-sm">{nodeData.titlePrefix} </span>}
                  {nodeName}
                  {nodeData.titleSuffix && <span className="text-gray-600 dark:text-gray-400 text-sm"> {nodeData.titleSuffix}</span>}
                </h4>
                
                {/* Status pernikahan */}
                {nodeData.maritalStatus && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {nodeData.maritalStatus === 'MARRIED' ? 'Menikah' : 
                     nodeData.maritalStatus === 'SINGLE' ? 'Belum Menikah' :
                     nodeData.maritalStatus === 'DIVORCED' ? 'Bercerai' :
                     nodeData.maritalStatus === 'WIDOWED' ? 'Janda/Duda' :
                     nodeData.maritalStatus === 'REMARRIED' ? 'Menikah Kembali' : ''}
                  </div>
                )}
              </div>
            </div>
            
            {/* Biodata - TTL, alamat, telepon */}
            <div 
              className="flex-1 text-xs text-gray-600 dark:text-gray-400 space-y-1.5 overflow-hidden cursor-pointer" 
              onClick={() => !isRootTemplate && handleNodeClick()}
            >
              {/* Tanggal Lahir & Tempat */}
              {(nodeData.birthDate || nodeData.birthPlace) && (
                <div className="flex items-start">
                  <IconCalendar className="w-3.5 h-3.5 mt-0.5 mr-1.5 flex-shrink-0" />
                  <div className="overflow-hidden">
                    <span className="block">
                      {nodeData.birthDate && formatDate(nodeData.birthDate)}
                      {nodeData.birthPlace && nodeData.birthDate && ` • `}
                      {nodeData.birthPlace && truncateText(nodeData.birthPlace, 30)}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Alamat */}
              {nodeData.address && (
                <div className="flex items-start">
                  <IconLocation className="w-3.5 h-3.5 mt-0.5 mr-1.5 flex-shrink-0" />
                  <span className="truncate block">{truncateText(nodeData.address, 40)}</span>
                </div>
              )}
              
              {/* Telepon */}
              {nodeData.phone && (
                <div className="flex items-start">
                  <IconPhone className="w-3.5 h-3.5 mt-0.5 mr-1.5 flex-shrink-0" />
                  <span>{nodeData.phone}</span>
                </div>
              )}

              {/* Tampilkan informasi pasangan jika ada */}
              {currentSpouse && (
                <div className="flex items-start mt-2 pt-1.5 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs mr-1.5">❤️</span>
                  <div>
                    <span className="font-medium">{truncateText(currentSpouse.fullName, 25)}</span>
                    {nodeData.maritalStatus === 'MARRIED' && (
                      <span className="text-gray-500 dark:text-gray-400 text-xs"> • Pasangan</span>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
              {/* Detail Button - tidak tampilkan pada template */}
              {!isRootTemplate && (
                <button
                  onClick={() => handleAction('details')}
                  className={`p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${nodeStyle.accent}`}
                  title="Lihat Detail"
                >
                  <IconInfo className="w-4 h-4" />
                </button>
              )}

              {/* Edit button */}
              {canEdit() && (
                <button
                  onClick={() => handleAction('edit')}
                  className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="Edit Data"
                >
                  <IconEdit className="w-4 h-4" />
                </button>
              )}

              {/* Add Button - tampilkan untuk users dengan permission */}
              {canAddNew() && (
                <button
                  onClick={() => handleAction('add')}
                  className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="Tambah Anggota Keluarga"
                >
                  <IconPlus className="w-4 h-4" />
                </button>
              )}

              {/* Expand Button - only show if has children */}
              {nodeData.hasChildren && (
                <button
                  onClick={() => handleAction('expand')}
                  className={`p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors
                    ${nodeData.isCollapsed ? '' : 'rotate-180'}`}
                  title={nodeData.isCollapsed ? 'Lihat Silsilah' : 'Sembunyikan Silsilah'}
                >
                  <IconChevronDown className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </foreignObject>
    </g>
  );
};

export default TreeNode;
// end of frontend/components/family-tree/TreeNode.tsx